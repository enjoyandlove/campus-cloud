import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { ApiService } from '@campus-cloud/base';
import { STATUS } from '@campus-cloud/shared/constants';
import { appStorage } from '@campus-cloud/shared/utils';
import { FileUploadService, CPI18nService } from '@campus-cloud/shared/services';

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

  constructor(
    private fileUploadService: FileUploadService,
    public cpI18n: CPI18nService,
    private api: ApiService
  ) {}

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
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;
    const auth = `${this.api.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res: any) => {
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
