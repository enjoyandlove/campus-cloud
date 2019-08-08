import { Component, OnInit, Inject } from '@angular/core';
import { AnimationEvent } from '@angular/animations';

import { ToastRef } from './toast-ref';
import { ToastData, TOAST_CONFIG_TOKEN, ToastConfig } from './toast-config';
import { toastAnimations, ToastAnimationState } from './toast-animation';

@Component({
  selector: 'cp-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  animations: [toastAnimations.fadeToast]
})
export class ToastComponent implements OnInit {
  animationState: ToastAnimationState = 'default';

  constructor(
    readonly data: ToastData,
    readonly ref: ToastRef,
    @Inject(TOAST_CONFIG_TOKEN) public toastConfig: ToastConfig
  ) {}

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
