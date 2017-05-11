import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { isDev } from '../../../../../config/env';
import { STATUS } from '../../../../../shared/constants';
import { FileUploadService } from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-lists-import',
  templateUrl: './lists-import.component.html',
  styleUrls: ['./lists-import.component.scss']
})
export class ListsImportComponent implements OnInit {
  @Output() launchCreateModal: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<any> = new EventEmitter();
  error;
  downloadLink;

  constructor(
    private fileService: FileUploadService
  ) {
    this.downloadLink = !isDev ?
    '/dist/templates/mass_user_upload.xlsx' :
    '/templates/mass_user_upload.xlsx';
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

  doReset() {
    this.teardown.emit();
  }

  onFileUpload(file) {
    console.log('File Uploaded');
    const validation = this.fileIsValid(file);
    this.error = '';

    if (!validation.length) {
      const url = !isDev ?
        '/announcements/import' :
        'http://localhost:8000/announcements/import';
      this
      .fileService
      .uploadFile(file, url)
      .subscribe(
        res => {
          this.doReset();
          $('#listsImport').modal('hide');
          this.launchCreateModal.emit(res);
        });
      return;
    }

    this.error = validation[0].error;
  }

  ngOnInit() { }
}
