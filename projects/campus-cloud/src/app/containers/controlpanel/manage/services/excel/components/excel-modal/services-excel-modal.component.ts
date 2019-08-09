import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { EnvService } from '@campus-cloud/config/env';
import { ServicesService } from '../../../services.service';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';

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
    private env: EnvService,
    private cpI18n: CPI18nService,
    private service: ServicesService,
    private fileService: FileUploadService
  ) {}

  parser(file) {
    const url =
      this.env.name !== 'development' ? '/services/excel' : 'http://localhost:8000/services/excel';

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
