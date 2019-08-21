import { Component, OnInit, Inject, Optional } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { ToastRef } from '../models';
import { defaultToastConfig } from '../config';
import { TOAST_CONFIG_TOKEN } from '../config/tokens';
import { toastAnimations } from '../config/animations';
import { ToastData, ToastAnimationState, ToastConfig } from '../config/types';

@Component({
  selector: 'ready-ui-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [toastAnimations.fadeToast]
})
export class ToastComponent implements OnInit {
  animationState: ToastAnimationState = 'default';

  constructor(
    readonly data: ToastData,
    readonly ref: ToastRef,
    @Optional() @Inject(TOAST_CONFIG_TOKEN) public _toastConfig: ToastConfig
  ) {}

  get toastConfig() {
    return this._toastConfig
      ? {
          ...(this._toastConfig || {}),
          ...defaultToastConfig
        }
      : defaultToastConfig;
  }

  ngOnInit() {}

  onDismissClicked() {
    this.animationState = 'closing';
    if ('dismissClickHandler' in this.data) {
      this.data.dismissClickHandler();
    }
  }

  onCtaClicked() {
    this.animationState = 'closing';
    if ('cta' in this.data && 'ctaClickHandler' in this.data.cta) {
      this.data.cta.ctaClickHandler();
    }
  }

  close() {
    this.ref.close();
  }

  onFadeFinished(event: AnimationEvent) {
    const { toState } = event;
    const isFadeOut = (toState as ToastAnimationState) === 'closing';
    const itFinished = this.animationState === 'closing';

    if (isFadeOut && itFinished) {
      this.close();
    }
  }
}
