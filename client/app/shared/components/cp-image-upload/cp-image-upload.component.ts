import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Headers } from '@angular/http';

import { API } from '../../../config/api';
import { CPArray, CPImage, appStorage } from '../../../shared/utils';
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
  @Output() uploaded: EventEmitter<string> = new EventEmitter();

  image;
  fileName;
  isLoading;
  errors = [];
  buttonText = 'Upload Photo';

  constructor(
    private fileUploadService: FileUploadService
  ) { }

  onFileUpload(file) {
    this.errors = [];

    if (!file) {
      this.image = null;
      return;
    }

    const fileExtension = CPArray.last(file.name.split('.'));

    if (!CPImage.isSizeOk(file.size, CPImage.MAX_IMAGE_SIZE)) {
      this.errors.push('File is too big');
      return;
    }

    if (!CPImage.isValidExtension(fileExtension, CPImage.VALID_EXTENSIONS)) {
      this.errors.push('Wrong extension');
      return;
    }

    this.isLoading = true;

    const headers = new Headers();
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    headers.append('Authorization', auth);

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
          this.errors.push('Something went wrong');
        }
      );
  }

  removeImage() {
    this.image = null;
    this.uploaded.emit(null);
  }

  ngOnInit() {
    if (this.defaultImage) {
      this.image = this.defaultImage;
    }
  }
}
