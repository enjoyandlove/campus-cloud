import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';
import { CPI18nService } from '../../../../../shared/services';
import {
  DivideBy,
  addGroup,
  groupByQuarter,
  groupByMonth,
  groupByWeek
} from '../../../../../shared/components/cp-line-chart/cp-line-chart.utils.service';

const year = 365;
const threeMonths = 90;
const twoYears = year * 2;

@Component({
  selector: 'cp-dashboard-downloads-registration',
  templateUrl: './dashboard-downloads-registration.component.html',
  styleUrls: ['./dashboard-downloads-registration.component.scss']
})
export class DashboardDownloadsRegistrationComponent extends BaseComponent implements OnInit {
  @Output() ready: EventEmitter<boolean> = new EventEmitter();

  _dates;
  loading;
  chartData;
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

  constructor(
    private session: CPSession,
    private cpi18n: CPI18nService,
    private service: DashboardService
) {
    super();
    super.isLoading().subscribe((loading) => {
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

        this.chartData = {
          series,
          range: this.range,
          divider: this.divider,
          tooltip_labels: {
            0: this.cpi18n.translate('t_dashboard_chart_tooltip_label_downloads'),
            1: this.cpi18n.translate('t_dashboard_chart_tooltip_label_registrations')
          }
        };
      });
  }

  ngOnInit() {}
}
