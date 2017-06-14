import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { isDev } from '../../../../../../../config/env';
import { ServicesService } from '../../../services.service';
import { STATUS } from '../../../../../../../shared/constants';
import { FileUploadService } from '../../../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-services-excel-modal',
  templateUrl: './services-excel-modal.component.html',
  styleUrls: ['./services-excel-modal.component.scss']
})
export class ServicesExcelModalComponent implements OnInit {
  error;
  uploaded;
  downloadLink;
  form: FormGroup;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: ServicesService,
    private fileService: FileUploadService,
  ) {
    this.form = this.fb.group({
      'link': [null, Validators.required]
    });

    this.downloadLink = isDev ? '/templates/mass_service_invite_sample.xlsx' :
                                '/dist/templates/mass_service_invite_sample.xlsx';
  }

  fileIsValid(file) {
    let result = [];
    let validators = [
      {
        'exp': file.name.split('.').pop() === 'xlsx',
        'error': STATUS.WRONG_EXTENSION,
        'isError': false
      },
      {
        'exp': file.size > 5000,
        'error': STATUS.FILE_IS_TOO_BIG,
        'isError': false
      }
    ];

    validators.map(validator => {
      if (!validator.exp) {
        validator.isError = true;
        result.push(validator);
      }
      return validator;
    });
    return result;
  }

  onFileUpload(file) {
    const validation = this.fileIsValid(file);
    this.error = '';

    if (!validation.length) {
      const url = !isDev ?
      '/services/excel' :
      'http://localhost:8000/services/excel';
      this
      .fileService
      .uploadFile(file, url)
      .subscribe(
        (res) => {
          this.uploaded = true;
          this.service.setModalServices(JSON.parse(res));
        },
        err => this.error = err.json().error
      );
      return;
    }

    this.error = validation[0].error;
  }

  onNavigate() {
    this.doReset();
    this.router.navigate(['/manage/services/import/excel']);
  }

  doReset() {
    this.error = '';
    this.uploaded = false;
    $('#excelServicesModal').modal('hide');
  }

  ngOnInit() { }
}
