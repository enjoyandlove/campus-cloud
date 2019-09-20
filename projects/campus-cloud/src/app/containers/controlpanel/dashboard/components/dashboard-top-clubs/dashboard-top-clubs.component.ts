import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { DashboardService } from '../../dashboard.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { DashboardUtilsService } from '../../dashboard.utils.service';
import { environment } from '@projects/campus-cloud/src/environments/environment';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dashboard-top-clubs',
  templateUrl: './dashboard-top-clubs.component.html',
  styleUrls: ['./dashboard-top-clubs.component.scss']
})
export class DashboardTopClubsComponent extends BaseComponent implements OnInit, OnDestroy {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  items = [];
  isSuperAdmin;
  defaultImage = `${environment.root}assets/default/user.png`;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public router: Router,
    private session: CPSession,
    private service: DashboardService,
    private helper: DashboardUtilsService
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
      .append('end', this._dates.end)
      .append('start', this._dates.start)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getTopClubs(search);

    super.fetchData(stream$).then((res) => (this.items = res.data));
  }

  ngOnInit() {
    this.isSuperAdmin = this.helper.isSuperAdmin(this.session);
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
