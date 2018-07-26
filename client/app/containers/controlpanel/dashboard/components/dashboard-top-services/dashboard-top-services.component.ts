import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';
import { DashboardUtilsService } from '../../dashboard.utils.service';

@Component({
  selector: 'cp-dashboard-top-services',
  templateUrl: './dashboard-top-services.component.html',
  styleUrls: ['./dashboard-top-services.component.scss']
})
export class DashboardTopServicesComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  canNavigate;
  items = [];

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(
    private session: CPSession,
    private service: DashboardService,
    private utils: DashboardUtilsService) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
      this.ready.emit(!this.loading);
    });
  }

  fetch() {
    const search = new HttpParams()
      .append('sort_by', 'engagements')
      .append('end', this._dates.end.toString())
      .append('start', this._dates.start.toString())
      .append('school_id', this.session.g.get('school').id.toString());

    const stream$ = this.service.getTopServices(search);

    super
      .fetchData(stream$)
      .then((res) => this.utils.parseServicesResponse(res.data.top_services))
      .then((res: any) => (this.items = res));
  }

  ngOnInit() {
    this.canNavigate = this.utils.isSuperAdmin(this.session);

    this.fetch();
  }
}
