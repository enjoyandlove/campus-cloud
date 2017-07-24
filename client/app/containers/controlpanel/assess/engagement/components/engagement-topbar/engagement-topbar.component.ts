import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import * as moment from 'moment';
import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils/date';
import { EngagementService } from '../../engagement.service';

const SERVICE_WITH_ATTENDANCE = '1';

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
  styleUrls: ['./engagement-topbar.component.scss']
})
export class EngagementTopBarComponent implements OnInit {
  @Output() doFilter: EventEmitter<IState> = new EventEmitter();

  engageMentFilter$;

  commonStudentFilter;

  commonEngageMentFilter;

  dateFilter;

  state: IState;

  studentFilter$;

  constructor(
    private session: CPSession,
    private service: EngagementService
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
        'label': '7 Days',
        'payload': {
          'metric': 'daily',
          'range': {
            start: now,
            end: lastWeek
          }
        }
      },
      {
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
        'label': 'All Engagements',
        'data': {
          type: null,
          value: null
        }
      },
      {
        'label': 'All Events',
        'data': {
          type: 'events',
          value: null
        }
      },
      {
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
        'label': 'All Students',
        'listId': null
      },
      {
        'label': 'Hockey Club List',
        'listId': 1
      }
    ];

    this.studentFilter$ = this
      .service
      .getLists(undefined, undefined, search)
      .startWith([this.commonStudentFilter[0]])
      .map(lists => {
        let _lists = [...this.commonStudentFilter];
        lists.forEach(list => {
          _lists.push(
            {
              'label': list.name,
              'listId': list.id
            }
          );
        });
        return _lists;
      });

    let serviceSearch = new URLSearchParams();
    serviceSearch.append('attendance_only', SERVICE_WITH_ATTENDANCE);

    this.engageMentFilter$ = this
      .service
      .getServices(undefined, undefined, serviceSearch)
      .startWith([this.commonEngageMentFilter[0]])
      .map(services => {
        let _services = [...this.commonEngageMentFilter];

        services.forEach(service => {
          _services.push(
            {
              'label': service.name,
              'data': {
                type: 'services',
                value: service.id
              }
            }
          );
        });

        return _services;
      });

    this.initState();
    this.doFilter.emit(this.state);
  }
}
