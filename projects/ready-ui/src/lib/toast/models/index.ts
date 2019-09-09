import { OverlayRef } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

import { ToastData } from '../config/types';

@Injectable()
export class ToastRef {
  data: ToastData;

  constructor(private readonly overlay: OverlayRef) {}

  close() {
    this.overlay.dispose();
  }

  isVisible() {
    return this.overlay && this.overlay.overlayElement;
  }

  getPosition() {
    return this.overlay.overlayElement.getBoundingClientRect();
  }
}
