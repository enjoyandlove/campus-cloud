import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EngagementService } from '../../engagement.service';
import { CPSession } from './../../../../../../session/index';
import { AssessUtilsService } from '../../../assess.utils.service';
import { CPTrackingService } from '../../../../../../shared/services';
import { BaseComponent } from '../../../../../../base/base.component';
import { EngagementUtilsService } from '../../engagement.utils.service';
import { environment } from './../../../../../../../environments/environment';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

const sortTypes = {
  0: 'engagements',
  1: 'count',
  2: 'average'
};

interface IState {
  sortBy: string;
  list_id: number;
  start: number;
  end: number;
  persona_id: number;
  scope: {
    queryParam: string;
    type: string;
    value: number;
  };
}

@Component({
  selector: 'cp-engagement-services-box',
  templateUrl: './engagement-services-box.component.html',
  styleUrls: ['./engagement-services-box.component.scss']
})
export class EngagementServicesBoxComponent extends BaseComponent implements OnInit {
  @Input() props: Observable<any>;

  labels;
  filters;
  isDisable;
  isSorting;
  sortingBy;
  eventProperties;
  loading = false;
  servicesRanking;
  state: IState = {
    sortBy: sortTypes[0],
    list_id: null,
    start: null,
    end: null,
    scope: null,
    persona_id: null
  };
  stats: Array<any>;
  sortyBy: Array<{ label: string; action: number }>;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: AssessUtilsService,
    public service: EngagementService,
    public cpTracking: CPTrackingService,
    public engagementUtils: EngagementUtilsService
  ) {
    super();
  }

  onSortBy(sortBy) {
    this.isSorting = true;
    this.trackAmplitudeEvent(sortBy.label);
    this.state = {
      ...this.state,
      sortBy: sortTypes[sortBy.action]
    };

    this.fetch();
  }

  trackAmplitudeEvent(sort_type) {
    this.eventProperties = {
      ...this.utils.getEventProperties(this.filters),
      card_type: amplitudeEvents.SERVICES,
      sort_type
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.ASSESS_VIEWED_CARDS, this.eventProperties);
  }

  fetch() {
    if (!this.isSorting) {
      this.loading = true;
    }

    let search = new HttpParams()
      .set('sort_by', this.state.sortBy)
      .set('end', this.state.end.toString())
      .set('start', this.state.start.toString())
      .set('school_id', this.session.g.get('school').id.toString());

    search =
      this.state.scope.queryParam === 'scope'
        ? search.append('scope', this.state.scope.value.toString())
        : search.append('service_id', this.state.scope.value.toString());

    if (this.state.persona_id) {
      search = search.append('persona_id', this.state.persona_id.toString());
    }

    if (this.state.list_id) {
      search = search.append('user_list_id', this.state.list_id.toString());
    }

    this.updateSortingLabel();

    super.fetchData(this.service.getServicesData(search)).then(
      (res) => {
        this.loading = false;
        this.isSorting = false;

        this.servicesRanking = this.parseResponse(res.data.top_services);

        this.stats = [
          {
            value: res.data.total_services,
            label: this.cpI18n.translate('assess_total_services'),
            icon: `${environment.root}public/png/assess/chart_service.png`
          },
          {
            value: res.data.total_services_with_attendance,
            label: this.cpI18n.translate('assess_services_assessed'),
            icon: `${environment.root}public/png/assess/chart_service_assess.png`
          },
          {
            value: res.data.total_attendees,
            label: this.cpI18n.translate('assess_total_attendees'),
            icon: `${environment.root}public/png/assess/chart_attendee.png`
          },
          {
            value: ((res.data.avg_feedbacks / 100) * 5).toFixed(1),
            label: this.cpI18n.translate('assess_average_rating'),
            icon: `${environment.root}public/png/assess/chart_rating.png`
          },
          {
            value: res.data.total_feedbacks,
            label: this.cpI18n.translate('assess_feedback_received'),
            icon: `${environment.root}public/png/assess/chart_feedback.png`
          }
        ];
      },

      (_) => {
        this.loading = false;
        this.isSorting = false;
      }
    );
  }

  parseResponse(items) {
    return items.map((item) => {
      return {
        name: item.service_name,
        image: item.service_logo_url,
        attendees: item.num_of_attendees,
        feedbacks: item.num_of_feedbacks,
        avg_feedbacks: item.average_of_feedbacks
      };
    });
  }

  updateSortingLabel() {
    Object.keys(sortTypes).map((key) => {
      if (sortTypes[key] === this.state.sortBy && this.sortyBy) {
        this.sortyBy.forEach((type) => {
          if (type.action === +key) {
            this.sortingBy = type;
          }
        });
      }
    });
  }

  ngOnInit() {
    this.labels = {
      heading: this.cpI18n.translate('services'),
      sub_heading: this.cpI18n.translate('assess_top_services')
    };

    this.sortyBy = this.engagementUtils.resourceSortingFilter();

    this.props.subscribe((res) => {
      const type = res.engagement.data.type;
      this.filters = res;
      this.isDisable = type === 'events' || type === 'orientations';

      this.state = {
        ...this.state,
        end: res.range.payload.range.end,
        scope: res.engagement.data,
        start: res.range.payload.range.start,
        list_id: res.for.listId,
        persona_id: res.for.personaId
      };

      if (!this.isDisable) {
        this.fetch();
      }
    });
  }
}
