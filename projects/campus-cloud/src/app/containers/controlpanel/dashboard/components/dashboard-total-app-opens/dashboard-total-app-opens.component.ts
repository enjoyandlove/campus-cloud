/*tslint:disable:no-host-metadata-property */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { kFormatter } from '@campus-cloud/shared/utils';
import { DashboardService } from './../../dashboard.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import {
  DivideBy,
  groupByWeek,
  groupByMonth,
  groupByQuarter,
  CPLineChartUtilsService
} from '@campus-cloud/shared/components/cp-line-chart/cp-line-chart.utils.service';
@Component({
  selector: 'cp-dashboard-total-app-opens',
  templateUrl: './dashboard-total-app-opens.component.html',
  styleUrls: ['./dashboard-total-app-opens.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-dashboard-total-app-opens'
  }
})
export class DashboardTotalAppOpensComponent extends BaseComponent {
  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  _dates;
  chartOptions;
  labels: string[] = [];
  series: number[] = [];
  divider = DivideBy.daily;
  loading$: Observable<boolean>;
  range: { start: string; end: string };

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: DashboardService,
    private utils: CPLineChartUtilsService
  ) {
    super();
    this.loading$ = super.isLoading();
  }

  errorHandler() {
    this.loading$ = of(false);
  }

  fetch() {
    const search = new HttpParams()
      .set('start', this._dates.start)
      .set('end', this._dates.end)
      .set('school_id', this.session.school.id.toString());

    const stream$ = this.service.getUserAcquisition(search);

    super
      .fetchData(stream$)
      .then(this.groupSeries.bind(this))
      .then(this.handleSuccess.bind(this))
      .catch(this.errorHandler.bind(this));
  }

  handleSuccess(series) {
    const [appOpens] = series;

    this.labels = this.utils.buildLabels(this.divider, this.range, series);
    this.series = this.utils.buildSeries(
      this.divider,
      this.range,
      [this.cpI18n.translate('t_dashboard_total_app_opens')],
      [appOpens]
    );

    this.chartOptions = {
      height: '237px',
      ...this.utils.chartOptions(this.divider, series),
      high: Math.max(...appOpens) + 5 - ((Math.max(...appOpens) + 5) % 5),
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: (value: number) => kFormatter(value, 0)
      }
    };
  }

  groupSeries({ data }) {
    const { labels, series } = data.app_opens;

    this.range = {
      start: labels[0],
      end: labels[labels.length - 1]
    };

    const year = 365;
    const threeMonths = 90;
    const twoYears = year * 2;
    const { app_opens, app_opens_unique } = data;
    this.divider = DivideBy.daily;

    if (app_opens.series.length >= twoYears) {
      this.divider = DivideBy.quarter;

      return Promise.all([
        groupByQuarter(app_opens.labels, app_opens.series),
        app_opens_unique.series
      ]);
    }

    if (app_opens.series.length >= year) {
      this.divider = DivideBy.monthly;

      return Promise.all([
        groupByMonth(app_opens.labels, app_opens.series),
        app_opens_unique.series
      ]);
    }

    if (app_opens.series.length >= threeMonths) {
      this.divider = DivideBy.weekly;

      return Promise.all([
        groupByWeek(app_opens.labels, app_opens.series),
        app_opens_unique.series
      ]);
    }

    return Promise.resolve([app_opens.series, app_opens_unique.series]);
  }
}
