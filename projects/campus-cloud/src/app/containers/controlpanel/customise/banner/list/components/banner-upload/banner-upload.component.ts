import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CPImageCropperDirective } from '@projects/campus-cloud/src/app/shared/directives';

const IMAGE_SIZE_WIDTH = 1440;
@Component({
  selector: 'cp-banner-upload',
  templateUrl: './banner-upload.component.html',
  styleUrls: ['./banner-upload.component.scss']
})
export class BannerUploadComponent implements OnInit {
  @ViewChild(CPImageCropperDirective)
  private imageCropper: CPImageCropperDirective;

  imageRatio = 1.8;
  croppieLoaded = false;
  boundary = IMAGE_SIZE_WIDTH / this.imageRatio;
  viewport = { width: 400, height: 400 / this.imageRatio };

  @Input() form: FormGroup;
  @Input() isEdit: boolean;
  @Input() uploading: boolean;

  @Input()
  set imageUrl(imageUrl: string) {
    if (this.isEdit) {
      this.changeDetector.detectChanges();
      this.initCropper(imageUrl);
    }
  }

  @Output() crop: EventEmitter<string> = new EventEmitter();
  @Output() upload: EventEmitter<any> = new EventEmitter();
  @Output() error: EventEmitter<string> = new EventEmitter();
  @Output() resetClick: EventEmitter<null> = new EventEmitter();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit() {}

  onResetClick() {
    this.croppieLoaded = false;
    this.resetClick.emit();
  }

  onSave() {
    this.imageCropper
      .result({
        type: 'base64',
        size: { width: IMAGE_SIZE_WIDTH, height: IMAGE_SIZE_WIDTH / this.imageRatio },
        format: 'jpeg'
      })
      .then((base64: string) => this.crop.emit(base64));
  }

  initCropper(url: string) {
    this.imageCropper.bind({ url }).then(() => (this.croppieLoaded = true));
  }
}
