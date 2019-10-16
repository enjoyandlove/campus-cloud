import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CCImage } from '@campus-cloud/shared/models';
import { CC_TILE_IMAGE_RATIO } from '@campus-cloud/shared/constants';
import { ImageService, ImageValidatorService, CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-banner-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss'],
  providers: [ImageService, ImageValidatorService]
})
export class BannerUploadButtonComponent implements OnInit {
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() upload: EventEmitter<string> = new EventEmitter();

  uploading = false;

  constructor(private imageService: ImageService, private cpI18n: CPI18nService) {}

  ngOnInit() {}

  onFileUpload(file) {
    this.reset.emit();

    if (!file) {
      return;
    }

    this.uploading = true;

    CCImage.getImageDimensions(file)
      .then(({ height, width }) => {
        if (width < 1440 || height < width / CC_TILE_IMAGE_RATIO) {
          throw new Error(this.cpI18n.translate('t_studio_banner_error_wrong_dimensions'));
        }
        this.imageService.upload(file).subscribe(
          ({ image_url }: any) => {
            this.uploading = false;
            this.upload.emit(image_url);
          },
          () => {
            this.uploading = false;
            this.error.emit(this.cpI18n.translate('t_studio_banner_error_wrong_dimensions'));
          }
        );
      })
      .catch((err) => {
        this.uploading = false;
        this.error.emit(err.message);
      });
  }
}
