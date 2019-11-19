import { HttpParams } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { startWith } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { BaseComponent } from '@campus-cloud/base';
import { DashboardService } from './../../dashboard.service';
import { DashboardUtilsService } from './../../dashboard.utils.service';
import { CPI18nService, DivideBy, ChartsUtilsService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-dashboard-unique-active-users',
  templateUrl: './dashboard-unique-active-users.component.html',
  styleUrls: ['./dashboard-unique-active-users.component.scss']
})
export class DashboardUniqueActiveUsersComponent extends BaseComponent {
  @Input()
  set dates(dates) {
    this.fetch();
  }

  series = [];
  labels: string[] = [];
  divider = DivideBy.daily;
  loading$: Observable<boolean>;
  range: { start: string; end: string };

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: DashboardService,
    private utils: ChartsUtilsService,
    private helper: DashboardUtilsService
  ) {
    super();
    this.loading$ = super.isLoading().pipe(startWith(true));
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

    this.labels = this.utils.buildLabels(this.divider, this.range, series);
    this.series = [
      {
        type: 'line',
        data: uniqueUsers,
        name: this.cpI18n.translate('t_dashboard_unique_active_users')
      }
    ];
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
