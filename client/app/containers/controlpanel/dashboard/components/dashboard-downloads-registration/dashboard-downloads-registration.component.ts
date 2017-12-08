import { Component, OnInit, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { BaseComponent } from '../../../../../base';
import { CPSession } from './../../../../../session';
import { DashboardService } from './../../dashboard.service';

const week = 7;
const year = 365;
const month = 30;
const threeMonths = 90;
const quarter = month * 3;
const twoYears = year * 2;

const groupEvery = (data: Number[], bound: number): Array<Number[]> => {
  let arr = [];
  let _data = [...data];

  while (_data.length > 0) {
    arr.push(_data.splice(0, bound));
  }

  return arr;
}

const addGroup = (data) => {
  return data.map((group: Number[]) => {
    return group.reduce((prev: number, next: number) => prev + next)
  })
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

  crunch(data, groupBy) {
    return new Promise(resolve => {
      resolve(addGroup(groupEvery(data, groupBy)))
    })
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
        if (res.data.series.length >= twoYears) {
          this.divider = DivideBy.quarter;
          return this.crunch(res.data.series, quarter);
        }

        if (res.data.series.length >= year) {
          this.divider = DivideBy.monthly;
          return this.crunch(res.data.series, month);
        }

        if (res.data.series.length >= threeMonths) {
          this.divider = DivideBy.weekly;
          return this.crunch(res.data.series, week);
        }

        this.divider = DivideBy.daily;
        return Promise.resolve(res.data.series);
      })
      .then(res => {
        const series = [
          res,
          this.mockSecondSeries(res)
        ];
        this.chartData = {
          series,
          divider: this.divider
        }

        const totals = addGroup(series);
        this.downloads = totals[0];
        this.registrations = totals[1];
      })
      .catch(err => console.log(err))
  }

  mockSecondSeries(series) {
    return series.map(serie => (serie + 1) * 4)
  }

  ngOnInit() { }
}
