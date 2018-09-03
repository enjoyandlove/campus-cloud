import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { CPCroppieService } from './../../services/croppie.service';
import { CPI18nService } from './../../services/i18n.service';
import { MODAL_TYPE } from './../cp-modal/cp-modal.component';

@Component({
  selector: 'cp-image-cropper',
  templateUrl: './cp-image-cropper.component.html',
  styleUrls: ['./cp-image-cropper.component.scss']
})
export class CPImageCropperComponent implements AfterViewInit, OnInit {
  @Input() imageUrl: String;

  @ViewChild('canvas') canvas: ElementRef;

  @Output() cancel: EventEmitter<null> = new EventEmitter();
  @Output() result: EventEmitter<string> = new EventEmitter();
  @Output() error: EventEmitter<string | null> = new EventEmitter();

  buttonData;
  croppie: CPCroppieService;
  modalWide = MODAL_TYPE.WIDE;

  constructor(public cpI18n: CPI18nService) {}

  initCanvas() {
    const hostEl = this.canvas.nativeElement;

    const canvasOptions = {
      showZoomer: false,
      enableResize: false,
      enableOrientation: true,
      viewport: { width: 540, height: 300 },
      boundary: { width: 770, height: 300 },
      url: `${this.imageUrl}?disableCache=true`
    };

    this.croppie = new CPCroppieService(hostEl, canvasOptions);
  }

  onCancel() {
    this.hideModal();
    this.cancel.emit();
  }

  ngAfterViewInit() {
    $('#imageCropper').modal();

    setTimeout(
      () => {
        this.initCanvas();
      },

      1
    );
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
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
