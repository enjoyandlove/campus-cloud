import { Component, OnInit } from '@angular/core';

const METRIC_TYPES = {
  0: 'Daily',
  1: 'Weekly'
};

interface IState {
  metric: string;
  filterByScope: {
    active: boolean;
    value: number;
  };
  filterByLists: {
    active: boolean;
    value: number;
  };
  filterByDateRange: {
    active: boolean;
    startDate: number;
    endDate: number;
  };
}

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent implements OnInit {
  state: IState = {
    metric: METRIC_TYPES[0],
    filterByScope: {
      active: false,
      value: null
    },
    filterByLists: {
      active: false,
      value: null
    },
    filterByDateRange: {
      active: false,
      startDate: null,
      endDate: null
    }
  };

  constructor() { }

  resetFilter() {
    this.state = {
      metric: METRIC_TYPES[0],

      filterByScope: {
        active: false,
        value: null
      },
      filterByLists: {
        active: false,
        value: null
      },
      filterByDateRange: {
        active: false,
        startDate: null,
        endDate: null
      }
    };
  }

  ngOnInit() {
    console.log('Engagement Component Init');
  }
}
