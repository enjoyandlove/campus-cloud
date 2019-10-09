/*tslint:disable:no-host-metadata-property */
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { kFormatter } from '@campus-cloud/shared/utils';
import { DashboardService } from './../../dashboard.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { DashboardUtilsService } from './../../dashboard.utils.service';
import {
  DivideBy,
  CPLineChartUtilsService
} from '@campus-cloud/shared/components/cp-line-chart/cp-line-chart.utils.service';

@Component({
  selector: 'cp-dashboard-unique-active-users',
  templateUrl: './dashboard-unique-active-users.component.html',
  styleUrls: ['./dashboard-unique-active-users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'cp-dashboard-unique-active-users'
  }
})
export class DashboardUniqueActiveUsersComponent extends BaseComponent {
  @Input()
  set dates(dates) {
    this.fetch();
  }

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
    private helper: DashboardUtilsService,
    private utils: CPLineChartUtilsService
  ) {
    super();
    this.loading$ = super.isLoading();
  }

  errorHandler() {
    this.loading$ = of(false);
  }

  fetch() {
    const { start, end } = this.helper.last90Days();
    const search = new HttpParams()
      .set('start', start.toString())
      .set('end', end.toString())
      .set('school_id', this.session.school.id.toString());

    const stream$ = this.service.getUserAcquisition(search);

    super
      .fetchData(stream$)
      .then(this.groupSeries.bind(this))
      .then(this.handleSuccess.bind(this))
      .catch(this.errorHandler.bind(this));
  }

  handleSuccess(series) {
    const [_, uniqueUsers] = series;
    this.labels = this.utils.buildLabels(this.divider, this.range, [uniqueUsers]);
    this.series = this.utils.buildSeries(
      this.divider,
      this.range,
      [this.cpI18n.translate('t_dashboard_unique_active_users')],
      [uniqueUsers]
    );

    this.chartOptions = {
      height: '237px',
      ...this.utils.chartOptions(this.divider, series),
      high: Math.max(...uniqueUsers) + 5 - ((Math.max(...uniqueUsers) + 5) % 5),
      axisY: {
        onlyInteger: true,
        labelInterpolationFnc: (value: number) => kFormatter(value, 0)
      },
      axisX: {
        labelInterpolationFnc: function limitXAxisLabelsLength(value, index) {
          // ignore last label
          if (index === uniqueUsers.length - 1) {
            return null;
          }

          return (value = index % 5 === 0 ? value : null);
        }
      }
    };
  }

  groupSeries({ data }) {
    const { labels, series } = data.app_opens_unique;

    this.range = {
      start: labels[0],
      end: labels[labels.length - 1]
    };

    return Promise.resolve([series, series]);
  }
}
