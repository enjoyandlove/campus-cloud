import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ENV } from '../../../../../../../config/env';
import { EventsService } from '../../../events.service';
import { STATUS } from '../../../../../../../shared/constants';
import { FileUploadService } from '../../../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-events-excel-modal',
  templateUrl: './events-excel-modal.component.html',
  styleUrls: ['./events-excel-modal.component.scss']
})
export class EventsExcelModalComponent implements OnInit {
  error;
  uploaded;
  downloadLink;
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: EventsService,
    private fileService: FileUploadService,
  ) {
    this.form = this.fb.group({
      'link': ['', Validators.required]
    });

    this.downloadLink = ENV === 'production' ?
                                '/dist/templates/mass_event_invite_sample.xlsx' :
                                '/templates/mass_event_invite_sample.xlsx';
  }

  onSubmit(data) {
    console.log(data);
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
      const url = ENV === 'production' ? '/events/excel' : 'http://localhost:8000/events/excel';
      this
      .fileService
      .uploadFile(file, url)
      .subscribe(
        (res) => {
          this.uploaded = true;
          this.service.setModalEvents(JSON.parse(res));
        },
        err => this.error = err.json().error
      );
      return;
    }

    this.error = validation[0].error;
  }

  onNavigate() {
    this.doReset();
    this.router.navigate(['/manage/events/import/excel']);
  }

  doReset() {
    this.error = '';
    this.uploaded = false;
    $('#excelEventsModal').modal('hide');
  }

  ngOnInit() {
    // console.log($('#excelModal'));
  }
}
