import {
  Input,
  OnInit,
  Output,
  ViewChild,
  Component,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import { CPI18nService } from './../../services/i18n.service';
import { MODAL_TYPE } from './../cp-modal/cp-modal.component';
import { CPImageCropperDirective } from '../../directives/cp-image-cropper';

@Component({
  selector: 'cp-image-cropper',
  templateUrl: './cp-image-cropper.component.html',
  styleUrls: ['./cp-image-cropper.component.scss']
})
export class CPImageCropperComponent implements AfterViewInit, OnInit {
  @Input() imageUrl: String;

  @ViewChild(CPImageCropperDirective, { static: true }) croppie: CPImageCropperDirective;

  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() result: EventEmitter<string> = new EventEmitter();
  @Output() error: EventEmitter<string | null> = new EventEmitter();

  buttonData;
  croppedImageLoaded = false;
  modalWide = MODAL_TYPE.WIDE;
  viewport = { width: 540, height: 300 };
  boundary = { width: 770, height: 300 };

  constructor(public cpI18n: CPI18nService) {}

  initCanvas(): Promise<void> {
    return this.croppie.bind({ url: `${this.imageUrl}?disableCache=true` });
  }

  onCancel() {
    this.hideModal();
    this.cancel.emit();
  }

  ngAfterViewInit() {
    $('#imageCropper').on('show.bs.modal', () => {
      this.initCanvas().then(() => {
        this.croppedImageLoaded = true;
        this.buttonData.disabled = false;
      });
    });
    $('#imageCropper').modal({ keyboard: true, focus: true });
  }

  imageToBase64(): Promise<any> {
    return this.croppie.result({
      type: 'base64',
      size: { width: 720, height: 400 },
      format: 'png'
    });
  }

  hideModal() {
    $('#imageCropper').modal('hide');
  }

  onSave() {
    this.imageToBase64()
      .then((imageData) => {
        this.hideModal();
        this.result.emit(imageData);
      })
      .catch((error) => {
        this.hideModal();
        this.error.emit(error);
      });
  }

  ngOnInit(): void {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
