import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { EngagementService } from '../../engagement.service';
import { CPSession } from './../../../../../../session/index';
import { AssessUtilsService } from '../../../assess.utils.service';
import { CPTrackingService } from '../../../../../../shared/services';
import { BaseComponent } from '../../../../../../base/base.component';
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
  scope: {
    queryParam: string;
    type: string;
    value: number;
  };
}

@Component({
  selector: 'cp-engagement-events-box',
  templateUrl: './engagement-events-box.component.html',
  styleUrls: ['./engagement-events-box.component.scss']
})
export class EngagementEventsBoxComponent extends BaseComponent implements OnInit {
  @Input() props: Observable<any>;

  filters;
  isDisable;
  isSorting;
  sortingBy;
  eventsRanking;
  eventProperties;
  loading = false;
  stats: Array<any>;
  state: IState = {
    sortBy: sortTypes[0],
    list_id: null,
    start: null,
    end: null,
    scope: null
  };

  defaultImage = require('public/default/user.png');
  sortyBy: Array<{ label: string; action: number }>;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: AssessUtilsService,
    public service: EngagementService,
    public cpTracking: CPTrackingService
  ) {
    super();
  }

  onSortBy(sortBy) {
    this.trackAmplitudeEvent(sortBy.label);
    this.isSorting = true;
    this.state = Object.assign({}, this.state, {
      sortBy: sortTypes[sortBy.action]
    });

    this.fetch();
  }

  trackAmplitudeEvent(sort_type) {
    this.eventProperties = {
      ...this.utils.getEventProperties(this.filters),
      sort_type
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.ASSESS_VIEWED_TOP_EVENTS,
      this.eventProperties
    );
  }

  fetch() {
    if (!this.isSorting) {
      this.loading = true;
    }

    const list_id = this.state.list_id ? this.state.list_id.toString() : null;

    let search = new HttpParams()
      .set('sort_by', this.state.sortBy)
      .set('end', this.state.end.toString())
      .set('start', this.state.start.toString())
      .set('user_list_id', list_id)
      .set('school_id', this.session.g.get('school').id.toString());

    search =
      this.state.scope.queryParam === 'scope'
        ? search.append('scope', this.state.scope.value.toString())
        : search.append('service_id', this.state.scope.value.toString());

    this.updateSortingLabel();

    super.fetchData(this.service.getEventsData(search)).then(
      (res) => {
        this.loading = false;
        this.isSorting = false;

        this.eventsRanking = res.data.top_events;

        this.stats = [
          {
            value: res.data.total_events,
            label: this.cpI18n.translate('assess_total_events'),
            icon: require('public/png/assess/chart_event.png')
          },
          {
            value: res.data.total_events_with_attendance,
            label: this.cpI18n.translate('assess_events_assessed'),
            icon: require('public/png/assess/chart_event_assess.png')
          },
          {
            value: res.data.total_attendees,
            label: this.cpI18n.translate('assess_total_attendees'),
            icon: require('public/png/assess/chart_attendee.png')
          },
          {
            value: (res.data.avg_feedbacks / 100 * 5).toFixed(1),
            label: this.cpI18n.translate('assess_average_rating'),
            icon: require('public/png/assess/chart_rating.png')
          },
          {
            value: res.data.total_feedbacks,
            label: this.cpI18n.translate('assess_feedback_received'),
            icon: require('public/png/assess/chart_feedback.png')
          }
        ];
      },
      (_) => {
        this.loading = false;
        this.isSorting = false;
      }
    );
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
    this.props.subscribe((res) => {
      this.filters = res;
      this.isDisable = res.engagement.data.type === 'services';

      this.state = Object.assign({}, this.state, {
        end: res.range.payload.range.end,
        scope: res.engagement.data,
        start: res.range.payload.range.start,
        list_id: res.for.listId
      });

      if (!this.isDisable) {
        this.fetch();
      }
    });

    this.sortyBy = [
      {
        label: this.cpI18n.translate('attendees'),
        action: 0
      },
      {
        label: this.cpI18n.translate('feedback'),
        action: 1
      },
      {
        label: this.cpI18n.translate('rating'),
        action: 2
      }
    ];

    this.sortingBy = this.sortyBy[0];
  }
}
