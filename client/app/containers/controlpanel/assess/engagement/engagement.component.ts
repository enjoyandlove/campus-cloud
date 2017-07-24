import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { EngagementService } from './engagement.service';
import { BaseComponent } from '../../../../base/base.component';

const METRIC_TYPES = {
  0: 'Daily',
  1: 'Weekly'
};

declare var $;

@Component({
  selector: 'cp-engagement',
  templateUrl: './engagement.component.html',
  styleUrls: ['./engagement.component.scss']
})
export class EngagementComponent extends BaseComponent implements OnInit {
  loading;
  chartData;

  filters$: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private service: EngagementService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  // updateUrl() {

  // }

  // getStateFromUrl() {

  // }

  onDoFilter(filterState) {
    this.fetchChartData(filterState);
    this.filters$.next(filterState);
  }

  buildSearchParam() {

  }

  fetchChartData(filterState) {
    console.log('filterState ', filterState);
    let search = new URLSearchParams();
    search.append('scope', filterState.engagement.data.type);
    search.append('list_id', filterState.for.listId);
    search.append('starts', `${filterState.range.payload.range.start}` );
    search.append('ends', `${filterState.range.payload.range.end}` );

    super
      .fetchData(this.service.getChartData(search))
      .then(res => {
        this.chartData = {
          ...res.data,
          starts: filterState.range.payload.range.start,
          ends: filterState.range.payload.range.end,
        };
       })
      .catch(err => console.log(err));
  }

  onDoCompose(): void {
    $('#composeModal').modal();
  }

  onComposeTeardown() {
    console.log('teardown');
  }

  ngOnInit() {
    console.log('Engagement Component Init');
  }
}
