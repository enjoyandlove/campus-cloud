import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-campus-tile',
  templateUrl: './dashboard-campus-tile.component.html',
  styleUrls: ['./dashboard-campus-tile.component.scss']
})
export class DashboardCampuTileComponent extends BaseComponent implements OnInit {
  _dates;
  loading;
  items = [];
  defaultImage = require('public/default/user.png');

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

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

    const stream$ = this.service.getCampusTile(search);

    super
      .fetchData(stream$)
      .then(res => this.items = res.data)
      .catch(err => console.log(err));

  }

  ngOnInit() {}
}
