import { Component, OnInit } from '@angular/core';

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

  ngOnInit() {
    this.dateFilter = [
      {
        'label': '7 Days',
        'action': null
      },
      {
        'label': '14 Days',
        'action': 1
      }
    ];

    this.scopeFilter = [
      {
        'label': 'All Engagements',
        'action': null
      },
      {
        'label': 'All Events',
        'action': 1
      }
    ];

    this.studentsFilter = [
      {
        'label': 'All Students',
        'action': null
      },
      {
        'label': 'Hockey Club List',
        'action': 1
      }
    ];
  }
}
