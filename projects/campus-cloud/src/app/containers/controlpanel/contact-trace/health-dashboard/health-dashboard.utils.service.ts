import { Injectable } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';
import { CPDate, createSpreadSheet } from '@projects/campus-cloud/src/app/shared/utils';

const EventType = {
  event: 'event',
  service: 'service',
  orientation: 'user_event'
};

export enum ExportCategory {
  AllForms = 1,
  CompletedToday = 2,
  NeverCompleted = 3,
  NotCompletedToday = 4,
  SourceApp = 5,
  SourceWeb = 6
}

@Injectable()
export class HealthDashboardUtilsService {
  readonly fileDateSignature = CPDate.format(new Date(), 'YYYY_MM_DD_HHmm');

  constructor(public cpI18nPipe: CPI18nPipe, public session: CPSession) {}

  getCompletedForm(res) {
    let newArray = [];
    res.map((item) => {
      let date = new Date(item.response_started_epoch * 1000);
      date.setHours(0, 0, 0, 0);
      if (
        newArray.length === 0 ||
        newArray[newArray.length - 1].date.getTime() !== date.getTime()
      ) {
        newArray =
          item.response_completed_epoch > 0
            ? [...newArray, { date: date, count: { views: 1, complete: 1 } }]
            : [...newArray, { date: date, count: { views: 1, complete: 0 } }];
      } else {
        newArray[newArray.length - 1].count.complete =
          item.response_completed_epoch > 0
            ? newArray[newArray.length - 1].count.complete + 1
            : newArray[newArray.length - 1].count.complete;
        newArray[newArray.length - 1].count.views += 1;
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

  createFormCSVData(forms, category, privacyOn: boolean = false) {
    const columns = !privacyOn
      ? [
          this.cpI18nPipe.transform('first_name'),
          this.cpI18nPipe.transform('last_name'),
          this.cpI18nPipe.transform('email'),
          this.cpI18nPipe.transform('student_id'),
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id')
        ]
      : [
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id')
        ];

    switch (category) {
      case ExportCategory.AllForms:
        columns.push(this.cpI18nPipe.transform('contact_trace_total_views'));
        columns.push(this.cpI18nPipe.transform('contact_trace_total_completions'));
        forms.map((item) => {
          Object.entries(item.form_response_data).map((k: any) => {
            if (!columns.includes(`${k[1].name}-Views`)) {
              columns.push(`${k[1].name}-Views`);
              columns.push(`${k[1].name}-Completions`);
            }
          });
        });
        break;
      case ExportCategory.CompletedToday:
        columns.push(this.cpI18nPipe.transform('contact_trace_total_completions'));
        forms.map((item) => {
          Object.entries(item.form_response_data).map((k: any) => {
            if (!columns.includes(`${k[1].name}-Completions`)) {
              columns.push(`${k[1].name}-Completions`);
            }
          });
        });
        break;
      case ExportCategory.NeverCompleted:
        break;
      case ExportCategory.NotCompletedToday:
        break;
      case ExportCategory.SourceApp:
        columns.push(this.cpI18nPipe.transform('contact_trace_total_views'));
        columns.push(this.cpI18nPipe.transform('contact_trace_total_completions'));
        break;
      case ExportCategory.SourceWeb:
        columns.push(this.cpI18nPipe.transform('contact_trace_total_views'));
        columns.push(this.cpI18nPipe.transform('contact_trace_total_completions'));
        break;
      default:
        break;
    }

    forms = forms.map((item) => {
      let row = !privacyOn
        ? {
            [this.cpI18nPipe.transform('first_name')]: item.firstname,

            [this.cpI18nPipe.transform('last_name')]: item.lastname,

            [this.cpI18nPipe.transform('email')]: item.extern_user_id,

            [this.cpI18nPipe.transform('student_id')]: item.student_id,

            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,

            [this.cpI18nPipe.transform('contact_trace_case_id')]: item.id
          }
        : {
            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,

            [this.cpI18nPipe.transform('contact_trace_case_id')]: item.id
          };
      switch (category) {
        case ExportCategory.AllForms:
          row = {
            ...row,

            [this.cpI18nPipe.transform('contact_trace_total_completions')]:
              item.total_app_submissions_count + item.total_web_submissions_count,

            [this.cpI18nPipe.transform('contact_trace_total_views')]:
              item.total_app_views_count + item.total_web_views_count
          };

          Object.entries(item.form_response_data).map((k: any) => {
            row = {
              ...row,
              [`${k[1].name}-Completions`]: k[1].app_submissions_count + k[1].web_submissions_count,
              [`${k[1].name}-Views`]: k[1].app_views_count + k[1].web_views_count
            };
          });
          break;
        case ExportCategory.CompletedToday:
          row = {
            ...row,
            [this.cpI18nPipe.transform('contact_trace_total_completions')]:
              item.total_app_submissions_count + item.total_web_submissions_count
          };
          Object.entries(item.form_response_data).map((k: any) => {
            row = {
              ...row,
              [`${k[1].name}-Completions`]: k[1].app_submissions_count + k[1].web_submissions_count
            };
          });
          break;
        case ExportCategory.NeverCompleted:
          break;
        case ExportCategory.NotCompletedToday:
          break;
        case ExportCategory.SourceApp:
          row = {
            ...row,

            [this.cpI18nPipe.transform(
              'contact_trace_total_completions'
            )]: item.total_app_submissions_count,

            [this.cpI18nPipe.transform('contact_trace_total_views')]: item.total_app_views_count
          };
          break;
        case ExportCategory.SourceWeb:
          row = {
            ...row,

            [this.cpI18nPipe.transform(
              'contact_trace_total_completions'
            )]: item.total_web_submissions_count,

            [this.cpI18nPipe.transform('contact_trace_total_views')]: item.total_web_views_count
          };
          break;
        default:
          break;
      }
      return row;
    });

    return { columns: columns, data: forms };
  }

  exportForms(forms, category, privacyOn) {
    const csvData = this.createFormCSVData(forms, category, privacyOn);
    createSpreadSheet(csvData.data, csvData.columns);
  }
}
