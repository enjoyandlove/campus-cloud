import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { DashboardService } from './../../dashboard.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { DashboardUtilsService } from './../../dashboard.utils.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dashboard-general-information',
  templateUrl: './dashboard-general-information.component.html',
  styleUrls: ['./dashboard-general-information.component.scss']
})
export class DashboardGeneralInformationComponent extends BaseComponent
  implements OnInit, OnDestroy {
  data;
  loading;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private session: CPSession,
    public route: ActivatedRoute,
    private service: DashboardService,
    public utils: DashboardUtilsService
  ) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
      });
  }

  fetch(start, end) {
    const search = new HttpParams()
      .append('end', end)
      .append('start', start)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getGeneralInformation(search);

    super.fetchData(stream$).then((res) => {
      this.data = res.data;
    });
  }

  listenForQueryParamChanges() {
    // instead of passing @Input(s) we update the queryParams
    // and call the fetch event whenever any of those values change
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const validParams = this.utils.validParams(params);
      if (!validParams) {
        return;
      }

      const { start, end } = params;

      this.fetch(start, end);
    });
  }

  ngOnInit() {
    this.listenForQueryParamChanges();
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
