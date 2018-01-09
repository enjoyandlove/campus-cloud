import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-social-activity',
  templateUrl: './dashboard-social-activity.component.html',
  styleUrls: ['./dashboard-social-activity.component.scss'],
})
export class DashboardSocialActivyComponent extends BaseComponent
  implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  chartData;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(private session: CPSession, private service: DashboardService) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }

  calculatePercentage(data) {
    const flatten = require('lodash').flatten;
    const total = flatten(data.series).reduce(
      (prev, curr) => {
        return prev + curr;
      },

      0,
    );

    return data.series.map((item) => (item * 100 / total).toFixed(1));
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('end', this._dates.end);
    search.append('start', this._dates.start);
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getSocialActivity(search);

    super.fetchData(stream$).then((res) => {
      this.chartData = {
        ...res.data,
        percentage: this.calculatePercentage(res.data),
      };
    });
  }

  ngOnInit() {
    this.fetch();
  }
}
