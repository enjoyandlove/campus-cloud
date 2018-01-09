import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../.././../../../config/api';
import { STATUS } from '../../../.././../../../shared/constants';
import { FileUploadService } from '../../../.././../../../shared/services';
import { appStorage } from '../../../.././../../../shared/utils';

@Component({
  selector: 'cp-customization-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class CustomizationUploadButtonComponent implements OnInit {
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() upload: EventEmitter<string> = new EventEmitter();

  _error;

  constructor(
    private fileUploadService: FileUploadService
  ) { }

  ngOnInit() { }

  onFileUpload(file) {
    this.reset.emit();

    if (!file) { return; }

    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.error.emit(validate.errors[0]);
      return;
    }

    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => this.upload.emit(res.image_url),
      _ => this.error.emit(STATUS.SOMETHING_WENT_WRONG)
      );
  }

}
