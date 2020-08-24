import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EnvService } from '@campus-cloud/config/env';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { baseActions } from '@projects/campus-cloud/src/app/store';

@Component({
  selector: 'cp-cases-excel-modal',
  templateUrl: './cases-excel-modal.component.html',
  styleUrls: ['./cases-excel-modal.component.scss']
})
export class CasesExcelModalComponent implements OnInit {
  options;
  fileName;

  constructor(
    private router: Router,
    private env: EnvService,
    private cpI18n: CPI18nService,
    private fileService: FileUploadService,
    private store: Store<any>
  ) {}

  parser(file) {
    const url =
      this.env.name !== 'development' ? '/cases/excel' : 'http://localhost:8000/cases/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.setModalCases(JSON.parse(res));

        return Promise.resolve();
      })
      .catch((err) => {
        const caseErr = err.error.error;

        return Promise.reject(caseErr ? caseErr : this.cpI18n.translate('something_went_wrong'));
      });
  }

  onNavigate() {
    this.router.navigate(['/contact-trace/cases/import/excel']);
  }

  setModalCases(cases: any[]): void {
    this.store.dispatch({
      type: baseActions.CASES_MODAL_SET,
      payload: cases
    });
  }

  ngOnInit() {
    this.fileName = 'mass_cases_upload.csv';

    const templateUrl =
      this.env.name === 'development'
        ? `/assets/templates/${this.fileName}`
        : `${environment.root}assets/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
