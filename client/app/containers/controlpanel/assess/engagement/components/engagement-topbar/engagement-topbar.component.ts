import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import * as moment from 'moment';
import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils/date';
import { EngagementService } from '../../engagement.service';

@Component({
  selector: 'cp-engagement-topbar',
  templateUrl: './engagement-topbar.component.html',
  styleUrls: ['./engagement-topbar.component.scss']
})
export class EngagementTopBarComponent implements OnInit {
  dateFilter;

  engageMentFilter$;

  studentFilter$;

  constructor(
    private session: CPSession,
    private service: EngagementService
  ) { }

  onDateRangeChange(date) {
    console.log(date);
  }

  onScopeChange(scope) {
    console.log(scope);
  }

  onStudentChange(list) {
    console.log(list);
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
        'range': {
          start: now,
          end: lastWeek
        }
      },
      {
        'label': 'Last Month',
        'range': {
          start: now,
          end: lastMonth
        }
      },
      {
        'label': 'Last 6 Weeks',
        'range': {
          start: now,
          end: sixWeeks
        }
      },
      {
        'label': 'Last 3 Months',
        'range': {
          start: now,
          end: threeMonths
        }
      }
    ];

    let engagementFilter = [
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
      }
    ];

    let studentsFilter = [
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
      .startWith([studentsFilter[0]])
      .map(lists => {
        let _lists = [...studentsFilter];
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

    this.engageMentFilter$ = this
      .service
      .getServices(undefined, undefined)
      .startWith([engagementFilter[0]])
      .map(services => {
        let _services = [...engagementFilter];

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
  }
}
