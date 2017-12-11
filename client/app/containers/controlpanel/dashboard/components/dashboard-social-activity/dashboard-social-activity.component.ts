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
  _dates;
  chartData;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  loading;

  constructor(
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }


  fetch() {
    const search = new URLSearchParams();
    search.append('start', this._dates.start);
    search.append('end', this._dates.end);

    const stream$ = this.service.getSocialActivity(search);

    super
      .fetchData(stream$)
      .then(res => {
        this.chartData = res.data;
        console.log('chart', res.data);
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetch();
  }
}
