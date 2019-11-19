import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { DashboardService } from './../../dashboard.service';
import {
  DivideBy,
  groupByWeek,
  groupByMonth,
  CPI18nService,
  groupByQuarter,
  ChartsUtilsService
} from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-dashboard-total-app-opens',
  templateUrl: './dashboard-total-app-opens.component.html',
  styleUrls: ['./dashboard-total-app-opens.component.scss']
})
export class DashboardTotalAppOpensComponent extends BaseComponent {
  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  _dates;
  series;
  labels: string[] = [];
  divider = DivideBy.daily;
  loading$: Observable<boolean>;
  range: { start: string; end: string };

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: DashboardService,
    private utils: ChartsUtilsService
  ) {
    super();
    this.loading$ = super.isLoading().pipe(startWith(true));
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
    this.series = [
      {
        type: 'line',
        data: appOpens,
        name: this.cpI18n.translate('t_dashboard_total_app_opens')
      }
    ];
  }

  groupSeries({ data }) {
    const { labels } = data.app_opens;

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
