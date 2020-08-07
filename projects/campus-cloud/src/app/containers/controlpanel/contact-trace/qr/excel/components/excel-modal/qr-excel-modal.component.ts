import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '@campus-cloud/config/env';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { ProvidersService } from '../../../../../manage/services/providers.service';

@Component({
  selector: 'cp-qr-excel-modal',
  templateUrl: './qr-excel-modal.component.html',
  styleUrls: ['./qr-excel-modal.component.scss']
})
export class QrExcelModalComponent implements OnInit {
  options;
  fileName;

  constructor(
    private router: Router,
    private env: EnvService,
    private cpI18n: CPI18nService,
    private providersService: ProvidersService,
    private fileService: FileUploadService
  ) {}

  parser(file) {
    const url =
      this.env.name !== 'development' ? '/qr_codes/excel' : 'http://localhost:8000/qr_codes/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.providersService.setModalProviders(JSON.parse(res));

        return Promise.resolve();
      })
      .catch((err) => {
        const serverError = err.error.error;

        return Promise.reject(
          serverError ? serverError : this.cpI18n.translate('something_went_wrong')
        );
      });
  }

  onNavigate() {
    this.router.navigate(['/contact-trace/qr/import/excel']);
  }

  ngOnInit() {
    this.fileName = 'mass_qr_code_upload.csv';

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
