import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { DashboardService } from './../../dashboard.service';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { DashboardUtilsService } from '../../dashboard.utils.service';
import { canSchoolReadResource } from '../../../../../shared/utils/privileges';

@Component({
  selector: 'cp-dashboard-top-orientation',
  templateUrl: './dashboard-top-orientation.component.html',
  styleUrls: ['./dashboard-top-orientation.component.scss']
})
export class DashboardTopOrientationComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  items = [];
  canViewOrientation;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(
    public session: CPSession,
    public service: DashboardService,
    public utils: DashboardUtilsService) {
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

    const stream$ = this.service.getTopOrientation(search);

    super
      .fetchData(stream$)
      .then((res) => this.utils.parseOrientationResponse(res.data.top_events))
      .then((res: any) => (this.items = res));
  }

  ngOnInit() {
    this.canViewOrientation = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation);

    this.fetch();
  }
}
