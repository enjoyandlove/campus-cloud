import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { isDev } from '../../../../../../../config/env';
import { ServicesService } from '../../../services.service';
import { FileUploadService, CPI18nService } from '../../../../../../../shared/services';
import { environment } from '@campus-cloud/src/environments/environment';

@Component({
  selector: 'cp-services-excel-modal',
  templateUrl: './services-excel-modal.component.html',
  styleUrls: ['./services-excel-modal.component.scss']
})
export class ServicesExcelModalComponent implements OnInit {
  options;
  fileName;

  constructor(
    private router: Router,
    private cpI18n: CPI18nService,
    private service: ServicesService,
    private fileService: FileUploadService
  ) {}

  parser(file) {
    const url = !isDev ? '/services/excel' : 'http://localhost:8000/services/excel';

    return this.fileService
      .uploadFile(file, url)
      .toPromise()
      .then((res: any) => {
        this.service.setModalServices(JSON.parse(res));

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
    this.router.navigate(['/manage/services/import/excel']);
  }

  ngOnInit() {
    this.fileName = 'mass_service_invite_sample.csv';

    const templateUrl = isDev
      ? `/assets/templates/${this.fileName}`
      : `${environment.root}assets/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['csv'],
      parser: this.parser.bind(this)
    };
  }
}
