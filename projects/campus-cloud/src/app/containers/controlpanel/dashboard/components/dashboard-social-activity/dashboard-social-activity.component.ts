import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { DashboardService } from './../../dashboard.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dashboard-social-activity',
  templateUrl: './dashboard-social-activity.component.html',
  styleUrls: ['./dashboard-social-activity.component.scss']
})
export class DashboardSocialActivyComponent extends BaseComponent implements OnInit, OnDestroy {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  chartData;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(private session: CPSession, private service: DashboardService) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((loading) => {
        this.loading = loading;
        this.ready.emit(!this.loading);
      });
  }

  calculatePercentage(data) {
    const flatten = require('lodash').flatten;

    const total = flatten(data.series).reduce(
      (prev, curr) => {
        return prev + curr;
      },

      0
    );

    return data.series.map((item) => ((item * 100) / total).toFixed(1)).reverse();
  }

  fetch() {
    const search = new HttpParams()
      .append('end', this._dates.end)
      .append('start', this._dates.start)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getSocialActivity(search);

    super.fetchData(stream$).then((res) => {
      this.chartData = {
        ...res.data,
        percentage: this.calculatePercentage(res.data)
      };
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.emitDestroy();
  }
}
