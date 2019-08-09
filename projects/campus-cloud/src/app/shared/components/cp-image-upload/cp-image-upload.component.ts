import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

import { appStorage } from '@campus-cloud/shared/utils';
import { ApiService } from '@campus-cloud/base/services';
import { FileUploadService, CPI18nService, ZendeskService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-image-upload',
  templateUrl: './cp-image-upload.component.html',
  styleUrls: ['./cp-image-upload.component.scss']
})
export class CPImageUploadComponent implements OnInit {
  @Input() id = 'upload_component';
  @Input() small: boolean;
  @Input() required: boolean;
  @Input() maxFileSize: number;
  @Input() defaultImage: string;
  @Input() validationFn: Function;
  @Input() buttonText = this.cpI18n.translate('upload_picture');
  @Input() description = this.cpI18n.translate('component_cpimage_help');
  @Input() heading = this.cpI18n.translate('component_cpimage_description');

  @Output() uploaded: EventEmitter<string> = new EventEmitter();

  image;
  error;
  fileName;
  isLoading;
  zdArticle;

  constructor(
    public cpI18n: CPI18nService,
    private fileUploadService: FileUploadService,
    private api: ApiService
  ) {}

  async onFileUpload(file, asPromise?: boolean) {
    this.error = null;

    if (!file) {
      this.image = null;

      return;
    }

    let validate = this.fileUploadService.validImage(file, this.maxFileSize);

    if (this.validationFn) {
      try {
        validate = await this.validationFn(file);
      } catch (error) {
        validate = error;
      }
    }

    if (!validate.valid) {
      if (asPromise) {
        return Promise.reject(validate.errors[0]);
      }

      this.error = validate.errors[0];

      return;
    }

    this.isLoading = true;

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;
    const auth = `${this.api.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

    const headers = new HttpHeaders({
      Authorization: auth
    });

    if (asPromise) {
      return this.fileUploadService.uploadFile(file, url, headers).toPromise();
    }

    this.fileUploadService.uploadFile(file, url, headers).subscribe(
      (res: any) => {
        this.isLoading = false;
        this.image = res.image_url;
        this.uploaded.emit(res.image_url);
      },
      (_) => {
        this.isLoading = false;
        this.error = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  removeImage() {
    this.image = null;
    this.uploaded.emit(null);
  }

  ngOnInit() {
    const root = ZendeskService.zdRoot();
    this.zdArticle = `${root}/articles/360001101794-What-size-images-should-I-use-in-Campus-Cloud`;

    if (this.defaultImage) {
      this.image = this.defaultImage;
    }
  }
}
