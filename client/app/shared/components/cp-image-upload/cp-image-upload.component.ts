import { HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { API } from '../../../config/api';
import { FileUploadService } from '../../../shared/services/file-upload.service';
import { appStorage } from '../../../shared/utils';
import { CPI18nService, ZendeskService } from '../../services';

@Component({
  selector: 'cp-image-upload',
  templateUrl: './cp-image-upload.component.html',
  styleUrls: ['./cp-image-upload.component.scss']
})
export class CPImageUploadComponent implements OnInit {
  @Input() id = 'upload_component';
  @Input() small: boolean;
  @Input() required: boolean;
  @Input() defaultImage: string;
  @Input() heading: string;
  @Input() description: string;
  @Input() validationFn: Function;
  @Output() uploaded: EventEmitter<string> = new EventEmitter();

  image;
  error;
  fileName;
  isLoading;
  zdArticle;
  buttonText;

  constructor(public cpI18n: CPI18nService, private fileUploadService: FileUploadService) {}

  onFileUpload(file, asPromise?: boolean) {
    this.error = null;

    if (!file) {
      this.image = null;

      return;
    }

    let validate = this.fileUploadService.validImage(file);

    if (this.validationFn) {
      this.validationFn(file)
        .then(() => {
          validate = {
            valid: true,
            errors: []
          };
        })
        .catch((err) => {
          validate = {
            valid: false,
            errors: [err]
          };
        });
    }

    if (!validate.valid) {
      if (asPromise) {
        return Promise.reject(validate.errors[0]);
      }

      this.error = validate.errors[0];

      return;
    }

    this.isLoading = true;

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
    const auth = `${API.AUTH_HEADER.SESSION} ${appStorage.get(appStorage.keys.SESSION)}`;

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
    this.buttonText = this.cpI18n.translate('upload_picture');

    if (!this.heading) {
      this.heading = this.cpI18n.translate('component_cpimage_description');
    }

    if (!this.description) {
      this.description = this.cpI18n.translate('component_cpimage_help');
    }

    if (this.defaultImage) {
      this.image = this.defaultImage;
    }
  }
}
