import { Input, OnInit, Component, ViewEncapsulation } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
import { kFormatter } from '@campus-cloud/shared/utils';
import { DashboardService } from './../../dashboard.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { BaseComponent } from '@campus-cloud/base/base.component';
import {
  DivideBy,
  groupByWeek,
  groupByMonth,
  groupByQuarter,
  CPLineChartUtilsService
} from '@campus-cloud/shared/components/cp-line-chart/cp-line-chart.utils.service';

@Component({
  selector: 'cp-dashboard-app-usage',
  templateUrl: './dashboard-app-usage.component.html',
  styleUrls: ['./dashboard-app-usage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardAppUsageComponent extends BaseComponent implements OnInit {
  _dates;
  loading = true;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  appOpenSeries;
  uniqueActiveUsers;
  appOpenChartOptions;
  appOpenLabels: string[];
  divider = DivideBy.daily;
  uniqueAppOpenChartOptions;
  uniqueUsersLabels: string[];
  range: { start: string; end: string };
  thirtyDayRange: { start: string; end: string };

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: DashboardService,
    private utils: CPLineChartUtilsService
  ) {
    super();
    super.isLoading().subscribe((loading) => {
      this.loading = loading;
    });
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

  groupSeries({ data }) {
    const labels = data.app_opens.labels;

    this.range = {
      start: labels[0],
      end: labels[labels.length - 1]
    };

    this.thirtyDayRange =
      data.app_opens_unique.series.length >= 31
        ? {
            start: labels[labels.length - 31],
            end: labels[labels.length - 1]
          }
        : this.range;

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

  getChartOptions(series, sourceSeries) {
    return {
      height: '237px',
      ...this.utils.chartOptions(this.divider, series),
      high: Math.max(...sourceSeries) + 5 - ((Math.max(...sourceSeries) + 5) % 5),
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: (value: number) => kFormatter(value, 0)
      },
      axisX: {
        labelInterpolationFnc: function limitXAxisLabelsLength(value, index) {
          // ignore last label
          if (index === sourceSeries.length - 1) {
            return null;
          }

          if (sourceSeries.length > 6) {
            value = index % Math.floor(sourceSeries.length / 3) === 0 ? value : null;
          }
          return value;
        }
      }
    };
  }

  handleSuccess(series) {
    const moreThanThirtyDays = series[1].length > 31;
    const last30AppUnique = moreThanThirtyDays ? series[1].slice(series[1].length - 31) : series[1];

    this.appOpenChartOptions = this.getChartOptions(series, series[0]);
    this.uniqueAppOpenChartOptions = this.getChartOptions(series, last30AppUnique);

    this.appOpenLabels = this.utils.buildLabels(this.divider, this.range, series);
    this.uniqueUsersLabels = this.utils.buildLabels(
      DivideBy.daily,
      moreThanThirtyDays ? this.thirtyDayRange : this.range,
      [last30AppUnique]
    );

    this.appOpenSeries = this.utils.buildSeries(
      this.divider,
      this.range,
      [this.cpI18n.translate('t_dashboard_total_app_opens')],
      [series[0]]
    );
    this.uniqueActiveUsers = this.utils.buildSeries(
      DivideBy.daily,
      moreThanThirtyDays ? this.thirtyDayRange : this.range,
      [this.cpI18n.translate('t_dashboard_unique_active_users')],
      [last30AppUnique]
    );
  }

  errorHandler() {
    this.loading = false;
  }

  ngOnInit() {}
}
