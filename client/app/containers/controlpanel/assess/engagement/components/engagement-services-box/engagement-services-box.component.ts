import { Input, OnInit, Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { EngagementService } from '../../engagement.service';
import { CPSession } from './../../../../../../session/index';
import { BaseComponent } from '../../../../../../base/base.component';
import { CPI18nService } from './../../../../../../shared/services/i18n.service';

const sortTypes = {
  0: 'engagements',
  1: 'count',
  2: 'average',
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
  selector: 'cp-engagement-services-box',
  templateUrl: './engagement-services-box.component.html',
  styleUrls: ['./engagement-services-box.component.scss'],
})
export class EngagementServicesBoxComponent extends BaseComponent
  implements OnInit {
  @Input() props: Observable<any>;

  isDisable;
  isSorting;
  sortingBy;
  loading = false;
  servicesRanking;
  state: IState = {
    sortBy: sortTypes[0],
    list_id: null,
    start: null,
    end: null,
    scope: null,
  };
  stats: Array<any>;
  defaultImage = require('public/default/user.png');
  sortyBy: Array<{ label: string; action: number }>;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EngagementService,
  ) {
    super();
  }

  onSortBy(sortBy) {
    this.isSorting = true;
    this.state = Object.assign({}, this.state, {
      sortBy: sortTypes[sortBy.action],
    });

    this.fetch();
  }

  fetch() {
    if (!this.isSorting) {
      this.loading = true;
    }

    const list_id = this.state.list_id ? this.state.list_id.toString() : null;

    const search = new URLSearchParams();
    search.append('sort_by', this.state.sortBy);
    search.append('end', this.state.end.toString());
    search.append('start', this.state.start.toString());
    search.append('user_list_id', list_id);
    search.append('school_id', this.session.g.get('school').id.toString());

    if (this.state.scope.queryParam === 'scope') {
      search.append('scope', this.state.scope.value.toString());
    } else {
      search.append('service_id', this.state.scope.value.toString());
    }

    this.updateSortingLabel();

    super.fetchData(this.service.getServicesData(search)).then(
      (res) => {
        this.loading = false;
        this.isSorting = false;

        this.servicesRanking = res.data.top_services;

        this.stats = [
          {
            value: res.data.total_services,
            label: this.cpI18n.translate('assess_total_services'),
            icon: require('public/png/assess/chart_service.png'),
          },
          {
            value: res.data.total_services_with_attendance,
            label: this.cpI18n.translate('assess_services_assessed'),
            icon: require('public/png/assess/chart_service_assess.png'),
          },
          {
            value: res.data.total_attendees,
            label: this.cpI18n.translate('assess_total_attendees'),
            icon: require('public/png/assess/chart_attendee.png'),
          },
          {
            value: (res.data.avg_feedbacks / 100 * 5).toFixed(1),
            label: this.cpI18n.translate('assess_average_rating'),
            icon: require('public/png/assess/chart_rating.png'),
          },
          {
            value: res.data.total_feedbacks,
            label: this.cpI18n.translate('assess_feedback_received'),
            icon: require('public/png/assess/chart_feedback.png'),
          },
        ];
      },

      (_) => {
        this.loading = false;
        this.isSorting = false;
      },
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
      this.isDisable = res.engagement.data.type === 'events';

      this.state = Object.assign({}, this.state, {
        end: res.range.payload.range.end,
        scope: res.engagement.data,
        start: res.range.payload.range.start,
        list_id: res.for.listId,
      });

      if (!this.isDisable) {
        this.fetch();
      }
    });

    this.sortyBy = [
      {
        label: this.cpI18n.translate('attendees'),
        action: 0,
      },
      {
        label: this.cpI18n.translate('feedback'),
        action: 1,
      },
      {
        label: this.cpI18n.translate('rating'),
        action: 2,
      },
    ];

    this.sortingBy = this.sortyBy[0];
  }
}
