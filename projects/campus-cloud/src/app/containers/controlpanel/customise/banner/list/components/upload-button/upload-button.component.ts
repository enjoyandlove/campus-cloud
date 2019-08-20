import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CCImage } from '@campus-cloud/shared/models';
import { CC_TILE_IMAGE_RATIO } from '@campus-cloud/shared/constants';
import { ImageService, ImageValidatorService } from '@campus-cloud/shared/services';

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

  constructor(private imageService: ImageService) {}

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
          throw new Error('Wrong Dimensions');
        }
        this.imageService.upload(file).subscribe(
          ({ image_url }: any) => {
            this.uploading = false;
            this.upload.emit(image_url);
          },
          (err: Error) => {
            this.uploading = false;
            this.error.emit(err.message);
          }
        );
      })
      .catch((err) => {
        this.uploading = false;
        this.error.emit(err.message);
      });
  }
}
