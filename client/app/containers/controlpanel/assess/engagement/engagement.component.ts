import { createSpreadSheet } from './../../../../shared/utils/csv/parser';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPSession } from './../../../../session/index';
import { EngagementService } from './engagement.service';
import { STATUS } from './../../../../shared/constants/status';
import { BaseComponent } from '../../../../base/base.component';
import { HEADER_UPDATE } from './../../../../reducers/header.reducer';
import { SNACKBAR_SHOW } from './../../../../reducers/snackbar.reducer';

declare var $;

const ONE_ENGAGEMENT = 2;
const ZERO_ENGAGEMENT = 3;
const REPEAT_ENGAGEMENT = 1;

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent extends BaseComponent implements OnInit {
  chartData;
  loading;
  messageData;
  filterState;
  isComposeModal;

  filters$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public router: Router,
    public store: Store<any>,
    public session: CPSession,
    public service: EngagementService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  updateUrl() {
    this
      .router
      .navigate(
      ['/assess/dashboard'],
      {
        queryParams: {
          'engagement': this.filterState.engagement.route_id,
          'for': this.filterState.for.route_id,
          'range': this.filterState.range.route_id
        }
      }
      );
  }

  onDoFilter(filterState) {
    this.filterState = Object.assign({}, this.filterState, ...filterState);

    this.updateUrl();

    this.fetchChartData();

    this.filters$.next(this.filterState);
  }

  buildSearchHeaders(): URLSearchParams {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    search.append(this.filterState.engagement.data.queryParam,
      this.filterState.engagement.data.value);

    search.append('user_list_id', this.filterState.for.listId);
    search.append('start', `${this.filterState.range.payload.range.start}`);
    search.append('end', `${this.filterState.range.payload.range.end}`);

    return search;
  }

  fetchChartData() {
    const search = this.buildSearchHeaders();

    super
      .fetchData(this.service.getChartData(search))
      .then(res => {
        this.chartData = {
          ...res.data,
          starts: this.filterState.range.payload.range.start,
          ends: this.filterState.range.payload.range.end,
        };
      })
      .catch(err => { throw new Error(err) });
  }

  onDoCompose(data): void {
    this.messageData = data;
    this.isComposeModal = true;
    setTimeout(() => { $('#composeModal').modal(); }, 1);
  }

  onDownload(cohort) {
    let fileName = 'all_download_data';
    const search = this.buildSearchHeaders();
    search.append('download', '1');

    if (cohort) {
      search.append('cohort', cohort);

      switch (cohort) {
        case REPEAT_ENGAGEMENT:
          fileName = 'repeat_engagement';
          break;
        case ONE_ENGAGEMENT:
          fileName = 'one_engagement';
          break;
        case ZERO_ENGAGEMENT:
          fileName = 'zero_engagement';
          break;
      }
    }

    this
      .service
      .getChartData(search)
      .toPromise()
      .then(data => {
        const columns = [
          'Student Name',
          '# of Check-ins',
          '# of Responses',
          'Response Rate',
          'Average Rating',
          '# of Event Check-Ins',
          'Event Responses',
          'Event Response Rate',
          'Event Average Rating',
          '# of Service Check-ins',
          'Service Responses',
          'Services Response Rate',
          'Service Average Rating',
        ];

        const parsedData = data.download_data.map(item => {
          return {
            'Student Name': `${item.firstname} ${item.lastname}`,
            '# of Check-ins': item.total_checkins,
            '# of Responses': item.total_responses,
            'Response Rate': `${item.total_response_rate.toFixed(1)}%`,
            'Average Rating': (item.event_ratings + item.service_ratings) / 2,
            '# of Event Check-Ins': item.event_checkins,
            'Event Responses': item.event_responses,
            'Event Response Rate': `${item.event_response_rate.toFixed(1)}%`,
            'Event Average Rating': item.event_ratings,
            '# of Service Check-ins': item.service_checkins,
            'Service Responses': item.service_responses,
            'Services Response Rate': `${item.service_response_rate.toFixed(1)}%`,
            'Service Average Rating': item.service_ratings
          }
        })
        createSpreadSheet(parsedData, columns, fileName)

      })
      .catch(err => console.log(err));
  }

  onComposeTeardown() {
    this.isComposeModal = false;
    this.messageData = null;
  }

  onFlashMessage() {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        body: STATUS.MESSAGE_SENT,
        autoClose: true,
      }
    });
  }

  ngOnInit() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../assess.header.json')
    });
  }
}
