import { CPSession } from './../../../session/index';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CPDate } from './../../../shared/utils/date/date';
import { CPI18nService } from '../../services/i18n.service';

export enum DivideBy {
  'daily' = 0,
  'weekly' = 1,
  'monthly' = 2,
  'quarter' = 3
}

export const addGroup = (data) => {
  return data.map((group: Number[]) => {
    return group.reduce((prev: number, next: number) => prev + next);
  });
};

export const aggregate = (data: Number[], serie: Number[]): Promise<Number[]> => {
  const arr = [];

  data.reduce(
    (prev, current, index) => {
      if (prev === current) {
        arr[arr.length - 1] += serie[index];

        return current;
      }

      arr.push(serie[index]);

      return current;
    },

    0
  );

  return new Promise((resolve) => {
    resolve(arr);
  });
};

export const groupByWeek = (dates: any[], serie: Number[]) => {
  const datesByWeek = dates.map((d) => moment(d).week());

  return aggregate(datesByWeek, serie);
};

export const groupByMonth = (dates: any[], series: Number[]) => {
  const datesByMonth = dates.map((d) => moment(d).month());

  return aggregate(datesByMonth, series);
};

export const groupByQuarter = (dates: any[], series: Number[]) => {
  const datesByQuarter = dates.map((d) => moment(d).quarter());

  return aggregate(datesByQuarter, series);
};

@Injectable()
export class CPLineChartUtilsService {
  constructor(public session: CPSession) {
  }

  dailyLabel(range, index) {
    const date = CPDate.toEpoch(moment(range).add(index, 'days'), this.session.tz);

    return moment
      .unix(date)
      .locale(CPI18nService.getLocale())
      .format('MMM D');
  }

  weeklyLabel(range, index) {
    const weekOne = moment(range).add(index, 'weeks');

    const weekStart = CPDate.toEpoch(weekOne, this.session.tz);

    const weekEnd = CPDate.toEpoch(weekOne.add(1, 'weeks'), this.session.tz);

    return `${moment
      .unix(weekStart)
      .locale(CPI18nService.getLocale())
      .format('MMM D')} - ${moment
      .unix(weekEnd)
      .locale(CPI18nService.getLocale())
      .format('MMM D')}`;
  }

  monthlyLabel(range, index) {
    const date = CPDate.toEpoch(moment(range).add(index, 'months'), this.session.tz);

    return moment
      .unix(date)
      .locale(CPI18nService.getLocale())
      .format('MMM YY');
  }

  quarterLabel(range, index) {
    const date = CPDate.toEpoch(
      moment(range)
        .locale(CPI18nService.getLocale())
        .add(index, 'quarters'),
      this.session.tz
    );

    return moment
      .unix(date)
      .locale(CPI18nService.getLocale())
      .format('MMM YY');
  }
}
