import { Injectable } from '@angular/core';
import { FormResultExport } from '@controlpanel/contact-trace/forms/models';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { createSpreadSheet } from '@campus-cloud/shared/utils';

@Injectable({
  providedIn: 'root'
})
export class FormResponseExportService {

  constructor(public cpI18nPipe: CPI18nPipe) { }


  exportFormResponsesAsCsv(formResultExport: FormResultExport[], fileName: string) {
    const formExportData = this.createResponseCSVData(formResultExport);
    createSpreadSheet(formExportData.data, formExportData.columns, fileName);
  }

  private createResponseCSVData(formResultExport: FormResultExport[]) {
    let columns = [
      this.cpI18nPipe.transform('first_name'),
      this.cpI18nPipe.transform('last_name'),
      this.cpI18nPipe.transform('email'),
      this.cpI18nPipe.transform('contact_trace_forms_date'),
      this.cpI18nPipe.transform('contact_trace_forms_collection_method'),
      this.cpI18nPipe.transform('contact_trace_forms_result')
    ];
    columns = [...columns, ...formResultExport[0].question];

    const csvData = formResultExport.map((item) => {
      const data = {
        [this.cpI18nPipe.transform('first_name')]: item.fistname,
        [this.cpI18nPipe.transform('last_name')]: item.lastname,
        [this.cpI18nPipe.transform('email')]: item.extern_user_id,
        [this.cpI18nPipe.transform('contact_trace_forms_date')]: item.completionDate,
        [this.cpI18nPipe.transform('contact_trace_forms_collection_method')]: item.collectionMethod,
        [this.cpI18nPipe.transform('contact_trace_forms_result')]: item.result
      };

      for (let i = 0; i < item.question.length; i++) {
        data[item.question[i]] = item.answer[i];
      }
      return data;
    });

    return { columns, data: csvData };
  }
}
