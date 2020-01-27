import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { CheckinMethod } from '../constants';
import { CPSession } from '@campus-cloud/session';
import { baseActions } from '@campus-cloud/store/base';
import { EngagementService } from './engagement.service';
import { AssessUtilsService } from '../assess.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { createSpreadSheet } from '@campus-cloud/shared/utils/csv/parser';
import {
  DivideBy,
  groupByYear,
  groupByWeek,
  groupByMonth,
  CPI18nService,
  groupByQuarter,
  CPTrackingService,
  ChartsUtilsService
} from '@campus-cloud/shared/services';

declare var $;

const ONE_ENGAGEMENT = 2;
const ZERO_ENGAGEMENT = 3;
const REPEAT_ENGAGEMENT = 1;

const year = 365;
const sixMonths = 180;
const threeMonths = 90;
const twoYears = year * 2;

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent extends BaseComponent implements OnInit {
  labels;
  series;
  statsData;
  loading;
  messageData;
  filterState;
  isComposeModal;
  eventProperties;
  divider = DivideBy.daily;

  range = {
    start: null,
    end: null
  };

  filters$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public router: Router,
    public store: Store<any>,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: AssessUtilsService,
    public service: EngagementService,
    public cpTracking: CPTrackingService,
    public chartUtils: ChartsUtilsService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  updateUrl() {
    this.router.navigate(['/assess/dashboard'], {
      queryParams: {
        engagement: this.filterState.engagement.route_id,
        for: this.filterState.for.route_id,
        range: this.filterState.range.route_id,
        start: this.filterState.range.payload.range.start,
        end: this.filterState.range.payload.range.end
      }
    });
  }

  onDoFilter(filterState) {
    this.filterState = this.filterState
      ? Object.assign({}, this.filterState, filterState)
      : { ...filterState };

    this.updateUrl();

    this.fetchChartData();

    this.filters$.next(this.filterState);
  }

  buildSearchHeaders(): HttpParams {
    let search = new HttpParams();

    search = search
      .append('school_id', this.session.g.get('school').id.toString())
      .append('start', `${this.filterState.range.payload.range.start}`)
      .append('end', `${this.filterState.range.payload.range.end}`)
      .append(this.filterState.engagement.data.queryParam, this.filterState.engagement.data.value);

    if (this.filterState.for.personaId) {
      search = search.append('persona_id', this.filterState.for.personaId.toString());
    }

    if (this.filterState.for.listId) {
      search = search.append('user_list_id', this.filterState.for.listId.toString());
    }

    return search;
  }

  fetchChartData() {
    const search = this.buildSearchHeaders();

    super
      .fetchData(this.service.getChartData(search))
      .then((res) => {
        this.statsData = {
          ...res.data,
          starts: this.filterState.range.payload.range.start,
          ends: this.filterState.range.payload.range.end
        };

        this.range = Object.assign({}, this.range, {
          start: res.data.labels[0],
          end: res.data.labels[res.data.labels.length - 1]
        });

        if (res.data.series.length >= twoYears) {
          this.divider = DivideBy.yearly;

          return Promise.all([groupByYear(res.data.labels, res.data.series)]);
        }

        if (res.data.series.length >= year) {
          this.divider = DivideBy.quarter;

          return Promise.all([groupByQuarter(res.data.labels, res.data.series)]);
        }

        if (res.data.series.length >= sixMonths) {
          this.divider = DivideBy.monthly;

          return Promise.all([groupByMonth(res.data.labels, res.data.series)]);
        }

        if (res.data.series.length >= threeMonths) {
          this.divider = DivideBy.weekly;

          return Promise.all([groupByWeek(res.data.labels, res.data.series)]);
        }

        this.divider = DivideBy.daily;

        return Promise.resolve([res.data.series]);
      })
      .then((series: any) => {
        this.series = series.map((serie) => ({
          data: serie,
          type: 'line',
          name: this.cpI18n.translate('t_assess_chart_tooltip_label_engagements')
        }));
        this.labels = this.chartUtils.buildLabels(this.divider, this.range, series);
      });
  }

  onDoCompose(data): void {
    this.messageData = data;
    this.isComposeModal = true;
    setTimeout(
      () => {
        $('#composeModal').modal({ keyboard: true, focus: true });
      },

      1
    );
  }

  onDownload(cohort = null) {
    let engagement_type = amplitudeEvents.ALL_ENGAGEMENT;
    let fileName = 'all_download_data';
    let search = this.buildSearchHeaders();
    search = search.append('download', '1');

    if (cohort) {
      search = search.append('cohort', cohort);

      switch (cohort) {
        case REPEAT_ENGAGEMENT:
          fileName = 'repeat_engagement';
          engagement_type = amplitudeEvents.MULTIPLE_ENGAGEMENT;
          break;
        case ONE_ENGAGEMENT:
          fileName = 'one_engagement';
          engagement_type = amplitudeEvents.ONE_ENGAGEMENT;
          break;
        case ZERO_ENGAGEMENT:
          fileName = 'zero_engagement';
          engagement_type = amplitudeEvents.NO_ENGAGEMENT;
          break;
      }
    }

    this.service
      .getChartData(search)
      .toPromise()
      .then((data: any) => {
        this.trackDownloadEvent(engagement_type);

        const dataMap = [
          { label: 't_assess_first_name', key: 'firstname' },
          { label: 't_assess_last_name', key: 'lastname' },
          { label: 't_assess_email', key: 'email' },
          { label: 'assess_student_id', key: 'student_identifier' },
          { label: 't_assess_checkin_method', key: 'checkin_method' },
          { label: 't_assess_number_events', key: 'event_checkins' },
          { label: 't_assess_list_event_names', key: 'event_names' },
          { label: 't_assess_number_orientation_events', key: 'user_event_checkins' },
          { label: 't_assess_list_orientation_event_names', key: 'user_event_names' },
          { label: 't_assess_number_services', key: 'service_checkins' },
          { label: 't_assess_list_service_names', key: 'service_names' },
          { label: 't_assess_total_engagement', key: 'total_checkins' }
        ].map(({ label, key }) => ({ label: this.cpI18n.translate(label), key }));

        const columns = dataMap.map(({ label }) => label);

        let parsedData = [];
        data.download_data.forEach((item) => {
          let parsedItem = {};
          dataMap.forEach((mapping) => {
            let itemValue = item[mapping.key];
            if (mapping.key === 'checkin_method') {
              itemValue = CheckinMethod[itemValue];
            }
            if (itemValue) {
              parsedItem = {
                ...parsedItem,
                [mapping.label]: itemValue
              };
            }
          });
          parsedData = [...parsedData, parsedItem];
        });

        createSpreadSheet(parsedData, columns, fileName);
      });
  }

  onComposeTeardown() {
    this.isComposeModal = false;
    this.messageData = null;
  }

  onFlashMessage(data) {
    this.trackMessageEvent(data);
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        body: this.cpI18n.translate('announcement_success_sent'),
        autoClose: true
      }
    });
  }

  trackMessageEvent(data) {
    this.eventProperties = {
      ...this.utils.getEventProperties(this.filterState),
      host_type: data.hostType,
      engagement_type: data.props.label
    };
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.ASSESS_SENT_ANNOUNCEMENT,
      this.eventProperties
    );
  }

  trackDownloadEvent(engagement_type) {
    this.eventProperties = {
      ...this.utils.getEventProperties(this.filterState),
      engagement_type
    };
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.ASSESS_DOWNLOAD_DATA, this.eventProperties);
  }

  ngOnInit() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../assess.header.json')
    });
  }
}
