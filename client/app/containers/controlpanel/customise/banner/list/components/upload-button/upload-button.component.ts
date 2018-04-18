import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../.././../../../config/api';
import { STATUS } from '../../../.././../../../shared/constants';
import { appStorage } from '../../../.././../../../shared/utils';
import { FileUploadService, CPI18nService } from '../../../.././../../../shared/services';

@Component({
  selector: 'cp-banner-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class BannerUploadButtonComponent implements OnInit {
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() upload: EventEmitter<string> = new EventEmitter();

  _error;
  uploading = false;
  buttonText;

  constructor(private fileUploadService: FileUploadService, public cpI18n: CPI18nService) {}

  ngOnInit() {
    this.buttonText = this.cpI18n.translate('button_add_photo');
  }

  onFileUpload(file) {
    this.reset.emit();

    if (!file) {
      return;
    }

    const validate = this.fileUploadService.validImage(file);

    if (!validate.valid) {
      this.error.emit(validate.errors[0]);

      return;
    }

    this.uploading = true;
    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res) => {
        this.uploading = false;
        this.upload.emit(res.image_url);
      },
      (_) => {
        this.uploading = false;
        this.error.emit(STATUS.SOMETHING_WENT_WRONG);
      }
    );
  }
}
