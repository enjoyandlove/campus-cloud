import { Component, OnInit } from '@angular/core';

import * as moment from 'moment';
import { CPDate } from '../../../../../../shared/utils/date';

@Component({
  selector: 'cp-engagement-topbar',
  templateUrl: './engagement-topbar.component.html',
  styleUrls: ['./engagement-topbar.component.scss']
})
export class EngagementTopBarComponent implements OnInit {
  dateFilter;
  scopeFilter;
  studentsFilter;

  constructor() { }

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

    this.scopeFilter = [
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

    this.studentsFilter = [
      {
        'label': 'All Students',
        'listId': null
      },
      {
        'label': 'Hockey Club List',
        'listId': 1
      }
    ];
  }
}
