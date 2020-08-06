import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvService } from '@campus-cloud/config/env';
import { CPI18nService, FileUploadService } from '@campus-cloud/shared/services';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';

@Component({
  selector: 'cp-providers-excel-modal',
  templateUrl: './providers-excel-modal.component.html',
  styleUrls: ['./providers-excel-modal.component.scss']
})
export class ServicesProvidersExcelModalComponent implements OnInit {
  @Input() serviceId: number;
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
      this.env.name !== 'development'
        ? '/service_providers/excel'
        : 'http://localhost:8000/service_providers/excel';

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
    this.router.navigate([`/manage/services/${this.serviceId}/import/excel`]);
  }

  ngOnInit() {
    this.fileName = 'mass_service_provider_upload.csv';

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
