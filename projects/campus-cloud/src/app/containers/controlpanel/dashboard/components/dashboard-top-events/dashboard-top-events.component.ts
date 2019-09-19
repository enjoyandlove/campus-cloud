import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { DashboardService } from './../../dashboard.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { DashboardUtilsService } from '../../dashboard.utils.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dashboard-top-events',
  templateUrl: './dashboard-top-events.component.html',
  styleUrls: ['./dashboard-top-events.component.scss']
})
export class DashboardTopEventsComponent extends BaseComponent implements OnInit, OnDestroy {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  isSuperAdmin;
  items = [];

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private session: CPSession,
    private service: DashboardService,
    private utils: DashboardUtilsService
  ) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
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

    const stream$ = this.service.getTopEvents(search);

    super
      .fetchData(stream$)
      .then((res) => this.utils.parseEventsResponse(res.data.top_events))
      .then((res: any) => (this.items = res));
  }

  ngOnInit() {
    this.isSuperAdmin = this.utils.isSuperAdmin(this.session);

    this.fetch();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
