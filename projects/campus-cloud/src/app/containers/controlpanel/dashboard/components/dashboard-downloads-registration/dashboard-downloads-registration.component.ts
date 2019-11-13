import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { BaseComponent } from '@campus-cloud/base';
import { CPSession } from '@campus-cloud/session';
import { DashboardService } from './../../dashboard.service';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import {
  DivideBy,
  addGroup,
  groupByWeek,
  groupByMonth,
  CPI18nService,
  groupByQuarter,
  ChartsUtilsService
} from '@campus-cloud/shared/services';

const year = 365;
const threeMonths = 90;
const twoYears = year * 2;

@Mixin([Destroyable])
@Component({
  selector: 'cp-dashboard-downloads-registration',
  templateUrl: './dashboard-downloads-registration.component.html',
  styleUrls: ['./dashboard-downloads-registration.component.scss']
})
export class DashboardDownloadsRegistrationComponent extends BaseComponent
  implements OnInit, OnDestroy {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  series = [];
  labels = [];
  downloads = 0;
  registrations = 0;
  divider = DivideBy.daily;

  range = {
    start: null,
    end: null
  };

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private session: CPSession,
    private cpi18n: CPI18nService,
    private service: DashboardService,
    private utils: ChartsUtilsService
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
      .append('start', this._dates.start)
      .append('end', this._dates.end)
      .append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getDownloads(search);

    super
      .fetchData(stream$)
      .then((res) => {
        this.range = Object.assign({}, this.range, {
          start: res.data.labels[0],
          end: res.data.labels[res.data.labels.length - 1]
        });

        if (res.data.series[0].length >= twoYears) {
          this.divider = DivideBy.quarter;

          return Promise.all([
            groupByQuarter(res.data.labels, res.data.series[0]),
            groupByQuarter(res.data.labels, res.data.series[1])
          ]);
        }

        if (res.data.series[0].length >= year) {
          this.divider = DivideBy.monthly;

          return Promise.all([
            groupByMonth(res.data.labels, res.data.series[0]),
            groupByMonth(res.data.labels, res.data.series[1])
          ]);
        }

        if (res.data.series[0].length >= threeMonths) {
          this.divider = DivideBy.weekly;

          return Promise.all([
            groupByWeek(res.data.labels, res.data.series[0]),
            groupByWeek(res.data.labels, res.data.series[1])
          ]);
        }

        this.divider = DivideBy.daily;

        return Promise.resolve(res.data.series);
      })
      .then((series: any) => {
        const totals = addGroup(series);

        this.downloads = totals[0];
        this.registrations = totals[1];

        this.labels = this.utils.buildLabels(this.divider, this.range, series);
        this.series = series.map((data: number[], idx: number) => {
          return {
            data,
            type: 'line',
            lineStyle: {
              type: idx === 1 ? 'dashed' : undefined
            },
            name:
              idx === 0
                ? this.cpi18n.translate('t_dashboard_chart_tooltip_label_downloads')
                : this.cpi18n.translate('t_dashboard_chart_tooltip_label_registrations')
          };
        });
      })
      .catch(() => (this.loading = false));
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.emitDestroy();
  }
}
