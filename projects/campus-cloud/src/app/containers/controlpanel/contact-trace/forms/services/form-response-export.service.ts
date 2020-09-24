import { Injectable } from '@angular/core';
import { FormResultExport } from '@controlpanel/contact-trace/forms/models';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { createSpreadSheet, privacyConfigurationOn } from '@campus-cloud/shared/utils';
import { CPSession } from '@campus-cloud/session';

@Injectable({
  providedIn: 'root'
})
export class FormResponseExportService {
  constructor(public cpI18nPipe: CPI18nPipe, private session: CPSession) {}

  exportFormResponsesAsCsv(formResultExport: FormResultExport[], fileName: string) {
    const formExportData = this.createResponseCSVData(formResultExport);
    createSpreadSheet(formExportData.data, formExportData.columns, fileName);
  }

  private createResponseCSVData(formResultExport: FormResultExport[]) {
    let columns = !privacyConfigurationOn(this.session.g)
      ? [
          this.cpI18nPipe.transform('first_name'),
          this.cpI18nPipe.transform('last_name'),
          this.cpI18nPipe.transform('email'),
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id'),
          this.cpI18nPipe.transform('contact_trace_forms_date'),
          this.cpI18nPipe.transform('contact_trace_forms_collection_method'),
          this.cpI18nPipe.transform('contact_trace_forms_result')
        ]
      : [
          this.cpI18nPipe.transform('contact_trace_health_identifier'),
          this.cpI18nPipe.transform('contact_trace_case_id'),
          this.cpI18nPipe.transform('contact_trace_forms_date'),
          this.cpI18nPipe.transform('contact_trace_forms_collection_method'),
          this.cpI18nPipe.transform('contact_trace_forms_result')
        ];
    columns = [
      ...columns,
      ...formResultExport[0].question.map((question, index) => index + 1 + '. ' + question)
    ];

    const csvData = formResultExport.map((item) => {
      const caseId = item.case_id && item.case_id !== '0' ? item.case_id : '';
      const data = !privacyConfigurationOn(this.session.g)
        ? {
            [this.cpI18nPipe.transform('first_name')]: item.firstname,
            [this.cpI18nPipe.transform('last_name')]: item.lastname,
            [this.cpI18nPipe.transform('email')]: item.extern_user_id,
            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,
            [this.cpI18nPipe.transform('contact_trace_case_id')]: caseId,
            [this.cpI18nPipe.transform('contact_trace_forms_date')]: item.completionDate,
            [this.cpI18nPipe.transform(
              'contact_trace_forms_collection_method'
            )]: item.collectionMethod,
            [this.cpI18nPipe.transform('contact_trace_forms_result')]: item.result
          }
        : {
            [this.cpI18nPipe.transform(
              'contact_trace_health_identifier'
            )]: item.anonymous_identifier,
            [this.cpI18nPipe.transform('contact_trace_case_id')]: caseId,
            [this.cpI18nPipe.transform('contact_trace_forms_date')]: item.completionDate,
            [this.cpI18nPipe.transform(
              'contact_trace_forms_collection_method'
            )]: item.collectionMethod,
            [this.cpI18nPipe.transform('contact_trace_forms_result')]: item.result
          };

      for (let i = 0; i < item.question.length; i++) {
        data[i + 1 + '. ' + item.question[i]] = item.answer[i];
      }
      return data;
    });

    return { columns, data: csvData };
  }
}
