import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';

import * as moment from 'moment';

const year = 365;
const threeMonths = 90;
const twoYears = year * 2;

const addGroup = (data) => {
  return data.map((group: Number[]) => {
    return group.reduce((prev: number, next: number) => prev + next)
  })
}

const aggregate = (data: Number[], serie: Number[]): Promise<Number[]> => {
  let arr = [];

  data.reduce((prev, current, index) => {
    if (prev === current) {
      arr[arr.length - 1] += serie[index];
      return current;
    }

    arr.push(serie[index]);
    return current;
  }, 0);

  return new Promise(resolve => { resolve(arr); });
}

const groupByWeek = (dates: Date[], serie: Number[]) => {
  const datesByWeek = dates.map(d => { return moment(d).week() });
  return aggregate(datesByWeek, serie);
}

const groupByMonth = (dates: Date[], series: Number[]) => {
  const datesByMonth = dates.map(d => { return moment(d).month() });

  return aggregate(datesByMonth, series);
}

const groupByQuarter = (dates: Date[], series: Number[]) => {
  const datesByQuarter = dates.map(d => { return moment(d).quarter() });

  return aggregate(datesByQuarter, series);
}

export enum DivideBy {
  'daily' = 0,
  'weekly' = 1,
  'monthly' = 2,
  'quarter' = 3,
}

@Component({
  selector: 'cp-dashboard-downloads-registration',
  templateUrl: './dashboard-downloads-registration.component.html',
  styleUrls: ['./dashboard-downloads-registration.component.scss']
})
export class DashboardDownloadsRegistrationComponent extends BaseComponent implements OnInit {
  _dates;
  loading;
  chartData;
  downloads = 0;
  registrations = 0;
  divider = DivideBy.daily

  @Input()
  set dates(dates) {
    this._dates = dates;
    this.fetch();
  }

  constructor(
    private session: CPSession,
    private service: DashboardService
  ) {
    super();
    super.isLoading().subscribe(loading => this.loading = loading);
  }

  fetch() {
    const search = new URLSearchParams();
    search.append('start', this._dates.start);
    search.append('end', this._dates.end);
    search.append('school_id', this.session.g.get('school').id);

    const stream$ = this.service.getDownloads(search);

    super
      .fetchData(stream$)
      .then(res => {
        if (res.data.series[0].length >= twoYears) {
          this.divider = DivideBy.quarter;
          return Promise.all([groupByQuarter(res.data.labels, res.data.series[0]),
                             groupByQuarter(res.data.labels, res.data.series[1])])
        }

        if (res.data.series[0].length >= year) {
          this.divider = DivideBy.monthly;
          return Promise.all([groupByMonth(res.data.labels, res.data.series[0]),
                              groupByMonth(res.data.labels, res.data.series[1])])
        }

        if (res.data.series[0].length >= threeMonths) {
          this.divider = DivideBy.weekly;
          return Promise.all([groupByWeek(res.data.labels, res.data.series[0]),
                              groupByWeek(res.data.labels, res.data.series[1])])
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
          divider: this.divider
        };
      })
      .catch(err => console.log(err))
  }

  ngOnInit() { }
}
