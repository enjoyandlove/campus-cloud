import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../config/api';
import { CPI18nService } from '../../services';
import { CPImage, appStorage } from '../../../shared/utils';
import { FileUploadService } from '../../../shared/services/file-upload.service';

@Component({
  selector: 'cp-image-upload',
  templateUrl: './cp-image-upload.component.html',
  styleUrls: ['./cp-image-upload.component.scss']
})
export class CPImageUploadComponent implements OnInit {
  @Input() small: boolean;
  @Input() required: boolean;
  @Input() defaultImage: string;
  @Input() description: string;
  @Output() uploaded: EventEmitter<string> = new EventEmitter();

  image;
  fileName;
  isLoading;
  buttonText;
  errors = [];

  constructor(
    public cpI18n: CPI18nService,
    private fileUploadService: FileUploadService
  ) { }

  validateImage(file) {
    const fileExtension = file.name.split('.').pop();

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.errors.push(this.cpI18n.translate('error_file_is_too_big'));
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.errors.push(this.cpI18n.translate('error_invalid_extension'));
      return;
    }

  }

  onFileUpload(file, asPromise?: boolean) {
    this.errors = [];

    if (!file) {
      this.image = null;
      return;
    }

    this.validateImage(file);

    if (this.errors.length) {
      if (asPromise) {
        return Promise.reject(this.errors[0]);
      }
      return;
    }

    this.isLoading = true;

    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

    if (asPromise) {
      return this.fileUploadService.uploadFile(file, url, headers).toPromise();
    }

    this
      .fileUploadService
      .uploadFile(file, url, headers)
      .subscribe(
      res => {
        this.isLoading = false;
        this.image = res.image_url;
        this.uploaded.emit(res.image_url);
      },
      _ => {
        this.isLoading = false;
        this.errors.push(this.cpI18n.translate('something_went_wrong'));
      }
      );
  }

  removeImage() {
    this.image = null;
    this.uploaded.emit(null);
  }

  ngOnInit() {
    this.buttonText = this.cpI18n.translate('upload_picture');

    if (!this.description) {
      this.description = this.cpI18n.translate('component_cpimage_description');
    }

    if (this.defaultImage) {
      this.image = this.defaultImage;
    }
  }
}
