import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';

@Component({
  selector: 'cp-dashboard-top-clubs',
  templateUrl: './dashboard-top-clubs.component.html',
  styleUrls: ['./dashboard-top-clubs.component.scss']
})
export class DashboardTopClubsComponent extends BaseComponent implements OnInit {
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

    const stream$ = this.service.getTopClubs(search);

    super
      .fetchData(stream$)
      .then(res => this.items = res.data)
      .catch(err => console.log(err));

  }

  ngOnInit() {}
}
