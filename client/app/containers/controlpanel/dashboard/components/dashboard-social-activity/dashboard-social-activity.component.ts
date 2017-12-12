import { CPSession } from './../../../../../session/index';
import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-social-activity',
  templateUrl: './dashboard-social-activity.component.html',
  styleUrls: ['./dashboard-social-activity.component.scss']
})
export class DashboardSocialActivyComponent extends BaseComponent implements OnInit {
  total;
  _dates;
  chartData;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  loading;

  constructor(
    private session: CPSession,
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }


  fetch() {
    const search = new URLSearchParams();
    search.append('end', this._dates.end);
    search.append('start', this._dates.start);
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getSocialActivity(search);

    super
      .fetchData(stream$)
      .then(res => {
        const flatten = require('lodash').flatten;

        this.chartData = res.data;
        this.total = flatten(res.data.series).reduce((prev, curr) => { return prev + curr }, 0)
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
