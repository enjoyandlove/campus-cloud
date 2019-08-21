import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { ImageService, CPI18nService, ZendeskService } from '@campus-cloud/shared/services';

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
  @Input() buttonText = this.cpI18n.translate('upload_picture');
  @Input() description = this.cpI18n.translate('component_cpimage_help');
  @Input() heading = this.cpI18n.translate('component_cpimage_description');

  @Output() uploaded: EventEmitter<string> = new EventEmitter();

  image;
  error;
  fileName;
  isLoading;
  zdArticle;

  constructor(public cpI18n: CPI18nService, private imageService: ImageService) {}

  onFileUpload(file: File) {
    this.error = null;

    if (!file) {
      this.image = null;

      return;
    }

    this.imageService.upload(file).subscribe(
      ({ image_url }: any) => {
        this.isLoading = false;
        this.image = image_url;
        this.uploaded.emit(image_url);
      },
      (err) => {
        this.isLoading = false;
        this.error = err.message || this.cpI18n.translate('something_went_wrong');
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
