import { Injectable } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';

const EventType = {
  event: 'event',
  service: 'service',
  orientation: 'user_event'
};

@Injectable()
export class HealthDashboardUtilsService {
  constructor(public cpI18n: CPI18nService, public session: CPSession) {}
  getCompletedForm(res) {
    let newArray = [];
    res.map((item) => {
      let date = new Date(item.response_started_epoch * 1000);
      date.setHours(0, 0, 0, 0);
      if (
        newArray.length === 0 ||
        newArray[newArray.length - 1].date.getTime() !== date.getTime()
      ) {
        if (item.response_completed_epoch === -1) {
          newArray = [...newArray, { date: date, count: { views: 1, complete: 0 } }];
        } else {
          newArray = [...newArray, { date: date, count: { views: 0, complete: 1 } }];
        }
      } else {
        if (item.response_completed_epoch === -1) {
          newArray[newArray.length - 1].count.views += 1;
        } else {
          newArray[newArray.length - 1].count.complete += 1;
        }
      }
    });
    return newArray;
  }

  getDateArray(start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
      arr.push(this.formatDate(new Date(dt)));
      dt.setDate(dt.getDate() + 1);
    }
    return arr;
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
