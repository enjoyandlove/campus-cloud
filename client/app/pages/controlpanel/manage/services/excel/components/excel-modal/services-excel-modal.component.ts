import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { isDev } from '../../../../../../../config/env';
import { ServicesService } from '../../../services.service';
import { STATUS } from '../../../../../../../shared/constants';
import { FileUploadService } from '../../../../../../../shared/services';

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
    private service: ServicesService,
    private fileService: FileUploadService,
  ) { }

  parser(file) {
    const url = !isDev ? '/services/excel' : 'http://localhost:8000/services/excel';
    return this
      .fileService
      .uploadFile(file, url)
      .toPromise()
      .then(
      res => {
        this.service.setModalServices(JSON.parse(res));
        return Promise.resolve();
      }
      )
      .catch(
      err => {
        let serverError = err.json().error;
        return Promise.reject(serverError ? serverError : STATUS.SOMETHING_WENT_WRONG);
      }
      );
  }

  onNavigate() {
    this.router.navigate(['/manage/services/import/excel']);
  }

  ngOnInit() {
    this.fileName = 'mass_service_invite_sample.xlsx';

    let templateUrl = isDev ? `/templates/${this.fileName}` : `/dist/templates/${this.fileName}`;

    this.options = {
      templateUrl,
      validExtensions: ['xlsx'],
      parser: this.parser.bind(this)
    };
  }
}
