import { Injectable } from '@angular/core';
import { FormResultExport } from '@controlpanel/contact-trace/forms/models';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { createSpreadSheet } from '@campus-cloud/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class FormResponseExportService {

  constructor(public cpI18nPipe: CPI18nPipe) { }


  exportFormResponsesAsCsv(formResultExport: FormResultExport[], includeInternalUserFields: boolean, fileName: string) {
    const formExportData = this.createResponseCSVData(formResultExport, includeInternalUserFields);
    createSpreadSheet(formExportData.data, formExportData.columns, fileName);
  }

  private createResponseCSVData(formResultExport: FormResultExport[], includeInternalUserFields: boolean) {
    const columns = includeInternalUserFields ? [
      this.cpI18nPipe.transform('first_name'),
      this.cpI18nPipe.transform('last_name'),
      this.cpI18nPipe.transform('email'),
      this.cpI18nPipe.transform('contact_trace_forms_date'),
      this.cpI18nPipe.transform('contact_trace_forms_collection_method'),
      this.cpI18nPipe.transform('contact_trace_forms_result'),
      this.cpI18nPipe.transform('contact_trace_forms_question'),
      this.cpI18nPipe.transform('contact_trace_forms_answer')
    ] : [
      this.cpI18nPipe.transform('email'),
      this.cpI18nPipe.transform('contact_trace_forms_date'),
      this.cpI18nPipe.transform('contact_trace_forms_collection_method'),
      this.cpI18nPipe.transform('contact_trace_forms_result'),
      this.cpI18nPipe.transform('contact_trace_forms_question'),
      this.cpI18nPipe.transform('contact_trace_forms_answer')
    ];

    const csvData = includeInternalUserFields ? formResultExport.map((item) => {
      return {
        [this.cpI18nPipe.transform('first_name')]: item.fistname,
        [this.cpI18nPipe.transform('last_name')]: item.lastname,
        [this.cpI18nPipe.transform('email')]: item.extern_user_id,
        [this.cpI18nPipe.transform('contact_trace_forms_date')]: item.completionDate,
        [this.cpI18nPipe.transform('contact_trace_forms_collection_method')]: item.collectionMethod,
        [this.cpI18nPipe.transform('contact_trace_forms_result')]: item.result,
        [this.cpI18nPipe.transform('contact_trace_forms_question')]: item.question,
        [this.cpI18nPipe.transform('contact_trace_forms_answer')]: item.answer
      };
    }) : formResultExport.map((item) => {
      return {
        [this.cpI18nPipe.transform('email')]: item.extern_user_id,
        [this.cpI18nPipe.transform('contact_trace_forms_date')]: item.completionDate,
        [this.cpI18nPipe.transform('contact_trace_forms_collection_method')]: item.collectionMethod,
        [this.cpI18nPipe.transform('contact_trace_forms_result')]: item.result,
        [this.cpI18nPipe.transform('contact_trace_forms_question')]: item.question,
        [this.cpI18nPipe.transform('contact_trace_forms_answer')]: item.answer
      };
    });

    return { columns, data: csvData };
  }
}
