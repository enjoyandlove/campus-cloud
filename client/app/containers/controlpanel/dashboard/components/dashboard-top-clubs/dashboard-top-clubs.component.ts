import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';
import { DashboardUtilsService } from './../../dashboard.utils.service';

@Component({
  selector: 'cp-dashboard-top-clubs',
  templateUrl: './dashboard-top-clubs.component.html',
  styleUrls: ['./dashboard-top-clubs.component.scss']
})
export class DashboardTopClubsComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  items = [];
  isSuperAdmin;
  defaultImage = require('public/default/user.png');

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(
    public router: Router,
    private session: CPSession,
    private service: DashboardService,
    private helper: DashboardUtilsService
  ) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }

  fetch() {
    const search = new HttpParams()
      .append('end', this._dates.end)
      .append('start', this._dates.start)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getTopClubs(search);

    super.fetchData(stream$).then((res) => (this.items = res.data));
  }

  ngOnInit() {
    this.isSuperAdmin = this.helper.isSuperAdmin(this.session);
  }
}
