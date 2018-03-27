import { CPI18nService } from './../../../../../../shared/services/i18n.service';
import { OnInit, Output, Component, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import * as moment from 'moment';
import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils/date';

interface IState {
  engagement: {
    label: string;
    data: {
      type: string;
      value: number;
    };
  };

  for: {
    label: string;
    listId: number;
  };

  range: {
    label: string;
    payload: {
      metric: string;
      range: {
        start: number;
        end: number;
      };
    };
  };
}

@Component({
  selector: 'cp-engagement-topbar',
  templateUrl: './engagement-topbar.component.html',
  styleUrls: ['./engagement-topbar.component.scss']
})
export class EngagementTopBarComponent implements OnInit {
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();
  @Output() download: EventEmitter<boolean> = new EventEmitter();

  engageMentFilter;

  hasRouteData;

  commonStudentFilter;

  commonEngageMentFilter;

  dateFilter;

  state: IState;

  studentFilter;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute
  ) {}

  onDateRangeChange(payload) {
    this.updateState('range', payload);
  }

  onScopeChange(payload) {
    this.updateState('engagement', payload);
  }

  onStudentChange(payload) {
    this.updateState('for', payload);
  }

  updateState(key, payload) {
    this.state = Object.assign({}, this.state, { [key]: payload });

    this.doFilter.emit(this.state);
  }

  initState() {
    this.state = {
      engagement: {
        ...this.commonEngageMentFilter[0]
      },

      for: {
        ...this.commonStudentFilter[0]
      },

      range: {
        ...this.dateFilter[0]
      }
    };
  }

  getFromArray(arr: Array<any>, key: string, val: number) {
    return arr.filter((item) => item[key] === val)[0];
  }

  getStateFromUrl() {
    const routeParams: any = this.route.snapshot.queryParams;

    this.state = Object.assign({}, this.state, {
      engagement: {
        ...this.getFromArray(this.engageMentFilter, 'route_id', routeParams.engagement)
      },

      for: {
        ...this.getFromArray(this.studentFilter, 'route_id', routeParams.for)
      },

      range: {
        ...this.getFromArray(this.dateFilter, 'route_id', routeParams.range)
      }
    });

    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    const now = CPDate.toEpoch(new Date(), this.session.tz);
    const lastWeek = CPDate.toEpoch(
      moment()
        .subtract(6, 'days')
        .hours(0)
        .minutes(0)
        .seconds(0),
      this.session.tz
    );
    const lastMonth = CPDate.toEpoch(
      moment()
        .subtract(1, 'months')
        .hours(0)
        .minutes(0)
        .seconds(0),
      this.session.tz
    );
    const sixWeeks = CPDate.toEpoch(
      moment()
        .subtract(6, 'weeks')
        .hours(0)
        .minutes(0)
        .seconds(0),
      this.session.tz
    );
    const threeMonths = CPDate.toEpoch(
      moment()
        .subtract(3, 'months')
        .hours(0)
        .minutes(0)
        .seconds(0),
      this.session.tz
    );

    this.dateFilter = [
      {
        route_id: 'last_week',
        label: this.cpI18n.translate('assess_last_seven_days'),
        payload: {
          metric: 'daily',
          range: {
            end: now,
            start: lastWeek
          }
        }
      },
      {
        route_id: 'last_month',
        label: this.cpI18n.translate('assess_last_month'),
        payload: {
          metric: 'daily',
          range: {
            end: now,
            start: lastMonth
          }
        }
      },
      {
        route_id: 'last_six_weeks',
        label: this.cpI18n.translate('assess_last_six_weeks'),
        payload: {
          metric: 'weekly',
          range: {
            end: now,
            start: sixWeeks
          }
        }
      },
      {
        route_id: 'last_three_months',
        label: this.cpI18n.translate('assess_last_three_months'),
        payload: {
          metric: 'monthly',
          range: {
            end: now,
            start: threeMonths
          }
        }
      }
    ];

    this.commonEngageMentFilter = [
      {
        route_id: 'all',
        label: this.cpI18n.translate('assess_all_engagements'),
        data: {
          type: null,
          value: 0,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_services',
        label: this.cpI18n.translate('assess_all_services'),
        data: {
          type: 'services',
          value: 1,
          queryParam: 'scope'
        }
      },
      {
        route_id: 'all_events',
        label: this.cpI18n.translate('assess_all_events'),
        data: {
          type: 'events',
          value: 2,
          queryParam: 'scope'
        }
      }
    ];

    this.commonStudentFilter = [
      {
        route_id: 'all_students',
        label: this.cpI18n.translate('assess_all_students'),
        listId: null
      }
    ];

    this.route.data.subscribe((res: any) => {
      // @data [services, lists]
      const _lists = [...this.commonStudentFilter];
      const _engagements = [...this.commonEngageMentFilter];

      if (res.data[0].length) {
        _engagements.push({
          label: this.cpI18n.translate('services'),
          value: null,
          heading: true
        });
      }

      res.data[1].forEach((list) => {
        _lists.push({
          route_id: list.name
            .toLowerCase()
            .split(' ')
            .join('_'),
          label: list.name,
          listId: list.id
        });
      });

      res.data[0].forEach((service) => {
        _engagements.push({
          route_id: service.name
            .toLowerCase()
            .split(' ')
            .join('_'),
          label: service.name,
          data: {
            type: 'services',
            value: service.id,
            queryParam: 'service_id'
          }
        });
      });

      this.studentFilter = _lists;
      this.engageMentFilter = _engagements;
    });

    if (
      this.route.snapshot.queryParams['engagement'] &&
      this.route.snapshot.queryParams['for'] &&
      this.route.snapshot.queryParams['range']
    ) {
      this.hasRouteData = true;
    }

    this.initState();

    if (!this.hasRouteData) {
      this.doFilter.emit(this.state);

      return;
    }

    this.getStateFromUrl();
  }
}
