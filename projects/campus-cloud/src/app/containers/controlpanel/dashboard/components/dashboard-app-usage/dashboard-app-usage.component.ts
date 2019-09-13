/* tslint:disable:no-host-metadata-property */
import { Input, OnInit, Component, ViewEncapsulation } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@campus-cloud/session';
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
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-dashboard-app-usage'
  }
})
export class DashboardAppUsageComponent extends BaseComponent implements OnInit {
  _dates;
  loading = true;

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  range;
  labels;
  appOpenSeries;
  uniqueActiveUsers;
  divider = DivideBy.daily;
  chartOptions = {
    height: '237px'
  };

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

  builTooltip(label: string, value: number) {
    let dateText;
    let appOpenValue = 0;
    let activeUserValue = 0;
    const appOpens = this.cpI18n.translate('t_dashboard_total_app_opens');
    const activeUsers = this.cpI18n.translate('t_dashboard_unique_active_users');

    const appOpensChart = label.indexOf(appOpens) > -1;

    if (appOpensChart) {
      dateText = label.replace(appOpens, '').trim();

      appOpenValue = value;
      activeUserValue = this.uniqueActiveUsers[0].find((o) => o.meta.endsWith(dateText)).value;
    } else {
      dateText = label.replace(activeUsers, '').trim();

      activeUserValue = value;
      appOpenValue = this.appOpenSeries[0].find((o) => o.meta.endsWith(dateText)).value;
    }
    return `
    <div class="app-usage-tooltip-element">
      <span class="bold block">${dateText}</span>
      <span class="block">${appOpens}: <span class="bold">${appOpenValue}</span></span>
      <span class="block">${activeUsers}: <span class="bold">${activeUserValue}</span></span>
    </div>
    `;
  }

  groupSeries({ data }) {
    this.range = {
      start: data.app_opens.labels[0],
      end: data.app_opens.labels[data.app_opens.labels.length - 1]
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
        groupByQuarter(app_opens.labels, app_opens_unique.series)
      ]);
    }

    if (app_opens.series.length >= year) {
      this.divider = DivideBy.monthly;

      return Promise.all([
        groupByMonth(app_opens.labels, app_opens.series),
        groupByMonth(app_opens.labels, app_opens_unique.series)
      ]);
    }

    if (app_opens.series.length >= threeMonths) {
      this.divider = DivideBy.weekly;

      return Promise.all([
        groupByWeek(app_opens.labels, app_opens.series),
        groupByWeek(app_opens.labels, app_opens_unique.series)
      ]);
    }

    return Promise.resolve([app_opens.series, app_opens_unique.series]);
  }

  kFormatter(num: number) {
    return Math.abs(num) > 999
      ? Math.sign(num) * <any>(Math.abs(num) / 1000).toFixed(1) + 'k'
      : Math.sign(num) * Math.abs(num);
  }

  handleSuccess(series) {
    const options = {
      ...this.chartOptions,
      ...this.utils.chartOptions(this.divider, series),
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: function formatYAxisLabel(value: number) {
          return this.kFormatter(value);
        }.bind(this)
      },
      axisX: {
        labelInterpolationFnc: function limitXAxisLabelsLength(value, index) {
          // ignore last label
          if (index === series[0].length - 1) {
            return null;
          }

          if (series[0].length > 6) {
            value = index % Math.floor(series[0].length / 3) === 0 ? value : null;
          }
          return value;
        }
      }
    };
    this.chartOptions = options;

    this.labels = this.utils.buildLabels(this.divider, this.range, series);
    this.appOpenSeries = this.utils.buildSeries(
      this.divider,
      this.range,
      [this.cpI18n.translate('t_dashboard_total_app_opens')],
      [series[0]]
    );
    this.uniqueActiveUsers = this.utils.buildSeries(
      this.divider,
      this.range,
      [this.cpI18n.translate('t_dashboard_unique_active_users')],
      [series[1]]
    );
  }

  errorHandler() {
    this.loading = false;
  }

  ngOnInit() {}
}
