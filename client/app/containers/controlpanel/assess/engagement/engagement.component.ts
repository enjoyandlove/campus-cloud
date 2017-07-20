import { BehaviorSubject } from 'rxjs/BehaviorSubject';
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

declare var $;

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent implements OnInit {
  loading;

  filters$: BehaviorSubject<any> = new BehaviorSubject(null);

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

  constructor( ) { }

  onDoFilter(filterState) {
    this.filters$.next(filterState);
  }

  // fetch() {
  //   let search = new URLSearchParams();
  //   search.append('hello', 'World');

  //   const chart$ = this.service.getChartData(search);
  //   const events$ = this.service.getEventsData(search);
  //   const services$ = this.service.getServicesData(search);

  //   const stream$ = Observable.combineLatest(chart$, events$, services$);

  //   super
  //     .fetchData(stream$)
  //     .then(data => {
  //       console.log(data);
  //     })
  //     .catch(err => console.log(err));
  // }

  onDoCompose(): void {
    $('#composeModal').modal();
  }

  onComposeTeardown() {
    console.log('teardown');
  }

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
