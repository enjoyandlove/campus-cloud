import {
  OnInit,
  Output,
  Component,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';

import * as moment from 'moment';
import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils/date';

interface IState {
  engagement: {
    'label': string,
    'data': {
      type: string,
      value: number
    }
  };

  for: {
    'label': string,
    'listId': number
  };

  range: {
    'label': string,
    'payload': {
      'metric': string,
      'range': {
        start: number,
        end: number
      }
    }
  };
}

@Component({
  selector: 'cp-engagement-topbar',
  templateUrl: './engagement-topbar.component.html',
  styleUrls: ['./engagement-topbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EngagementTopBarComponent implements OnInit {
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();

  engageMentFilter;

  hasRouteData;

  commonStudentFilter;

  commonEngageMentFilter;

  dateFilter;

  state: IState;

  studentFilter;

  constructor(
    private session: CPSession,
    private route: ActivatedRoute
  ) { }

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
    this.state = Object.assign(
      {},
      this.state,
      { [key]: payload }
    );

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
    return arr.filter(item => item[key] === val)[0];
  }

  getStateFromUrl() {
    const routeParams: any = this.route.snapshot.queryParams;

    this.state = Object.assign(
      {},
      this.state,
      {
        engagement: {
          ...this.getFromArray(this.engageMentFilter, 'route_id', routeParams.engagement)
        },

        for: {
          ...this.getFromArray(this.studentFilter, 'route_id', routeParams.for)
        },

        range: {
          ...this.getFromArray(this.dateFilter, 'route_id', routeParams.range)
        }
      }
    );

    this.doFilter.emit(this.state);
  }

  ngOnInit() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    const now = CPDate.toEpoch(new Date());
    const lastWeek = CPDate.toEpoch(moment().subtract(7, 'days').hours(0).minutes(0).seconds(0));
    const lastMonth = CPDate.toEpoch(moment().subtract(1, 'months').hours(0).minutes(0).seconds(0));
    const sixWeeks = CPDate.toEpoch(moment().subtract(6, 'weeks').hours(0).minutes(0).seconds(0));
    const threeMonths = CPDate.toEpoch(
      moment().subtract(3, 'months').hours(0).minutes(0).seconds(0)
    );

    this.dateFilter = [
      {
        'route_id': 'last_week',
        'label': 'Last 7 Days',
        'payload': {
          'metric': 'daily',
          'range': {
            start: now,
            end: lastWeek
          }
        }
      },
      {
        'route_id': 'last_month',
        'label': 'Last Month',
        'payload': {
          'metric': 'daily',
          'range': {
            start: now,
            end: lastMonth
          }
        }
      },
      {
        'route_id': 'last_six_weeks',
        'label': 'Last 6 Weeks',
        'payload': {
          'metric': 'weekly',
          'range': {
            start: now,
            end: sixWeeks
          }
        }
      },
      {
        'route_id': 'last_three_months',
        'label': 'Last 3 Months',
        'payload': {
          'metric': 'monthly',
          'range': {
            start: now,
            end: threeMonths
          }
        }
      }
    ];

    this.commonEngageMentFilter = [
      {
        'route_id': 'all',
        'label': 'All Engagements',
        'data': {
          type: null,
          value: null
        }
      },
      {
        'route_id': 'all_events',
        'label': 'All Events',
        'data': {
          type: 'events',
          value: null
        }
      },
      {
        'route_id': 'all_services',
        'label': 'All Services',
        'data': {
          type: 'services',
          value: null
        }
      },
      {
        'label': 'Services',
        'value': null,
        'heading': true,
      }
    ];

    this.commonStudentFilter = [
      {
        'route_id': 'all_students',
        'label': 'All Students',
        'listId': null
      }
    ];

    this.route.data.subscribe((res: any) => {
      // @data [services, lists]
      let _lists = [...this.commonStudentFilter];
      let _engagements = [...this.commonEngageMentFilter];

      res.data[1].forEach(list => {
        _lists.push(
          {
            'route_id': list.name.toLowerCase().split(' ').join('_'),
            'label': list.name,
            'listId': list.id
          }
        );
      });

      res.data[0].forEach(service => {
        _engagements.push(
          {
            'route_id': service.name.toLowerCase().split(' ').join('_'),
            'label': service.name,
            'data': {
              type: 'services',
              value: service.id
            }
          }
        );
      });

      this.studentFilter = _lists;
      this.engageMentFilter = _engagements;
    });

    this.hasRouteData = Object.keys(this.route.snapshot.queryParams).length > 0;

    this.initState();

    if (!this.hasRouteData) {
      this.doFilter.emit(this.state);
      return;
    }

    this.getStateFromUrl();
  }
}
