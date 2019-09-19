import {
  Input,
  Output,
  OnInit,
  OnDestroy,
  Directive,
  ElementRef,
  EventEmitter
} from '@angular/core';
import * as Croppie from 'croppie';

const throwCroppieInstanceError = () => {
  throw Error('CPImageCropperDirective no instance found');
};

@Directive({
  selector: '[cpImageCropper]',
  exportAs: 'cpCropper'
})
export class CPImageCropperDirective implements OnInit, OnDestroy {
  croppie: Croppie;

  @Input() imgUrl: string;
  @Input() enableZoom = true;
  @Input() showZoomer = false;
  @Input() enableExif = false;
  @Input() mouseWheelZoom = true;
  @Input() enforceBoundary = true;
  @Input() enableOrientation = false;
  @Input() customClass = 'cp-croppie';
  @Input() boundary: { width: number; height: number };
  @Input() viewport: { width: number; height: number; type?: Croppie.CropType };

  @Output() update: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.croppie = new Croppie(this.el.nativeElement, {
      viewport: this.viewport,
      boundary: this.boundary,
      enableZoom: this.enableZoom,
      enableExif: this.enableExif,
      showZoomer: this.showZoomer,
      customClass: this.customClass,
      mouseWheelZoom: this.mouseWheelZoom,
      enforceBoundary: this.enforceBoundary,
      enableOrientation: this.enableOrientation
    });

    this.el.nativeElement.addEventListener('update', this.onUpdate.bind(this));
  }

  ngOnDestroy() {
    this.destroy();
    this.el.nativeElement.removeEventListener('update', this.onUpdate.bind(this));
  }

  get(): Croppie.CropData {
    if (!this.croppie) {
      throwCroppieInstanceError();
    }
    return this.croppie.get();
  }

  bind({
    url,
    zoom,
    points,
    useCanvas,
    orientation
  }: {
    url: string;
    zoom?: number;
    points?: number[];
    useCanvas?: boolean;
    orientation?: number;
  }): Promise<void> {
    if (!this.croppie) {
      throwCroppieInstanceError();
    }
    return this.croppie.bind({ url, points, orientation, zoom, useCanvas });
  }

  destroy() {
    if (!this.croppie) {
      throwCroppieInstanceError();
    }
    this.croppie.destroy();
  }

  result(options: Croppie.ResultOptions): Promise<string | Blob | HTMLElement | HTMLCanvasElement> {
    if (!this.croppie) {
      throwCroppieInstanceError();
    }
    return this.croppie.result(options);
  }

  rotate(degrees: 90 | 180 | 270 | -90 | -180 | -270) {
    if (!this.croppie) {
      throwCroppieInstanceError();
    }
    this.croppie.rotate(degrees);
  }

  setZoom(zoom: number) {
    if (!this.croppie) {
      throwCroppieInstanceError();
    }
    this.croppie.setZoom(zoom);
  }

  onUpdate(ev, cropData) {
    this.update.emit({ ev, cropData });
  }
}
