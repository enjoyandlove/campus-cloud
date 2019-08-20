import { TemplateRef } from '@angular/core';

export class ToastData {
  type: ToastType;
  text?: string;
  cta?: {
    text: string;
    url: string;
    ctaClickHandler?: () => void;
  };
  dismissClickHandler?: () => void;
  template?: TemplateRef<any>;
  templateContext?: {};
}

export interface ToastConfig {
  position?: {
    top: number;
  };
  animation?: {
    fadeOut: number;
    fadeIn: number;
  };
}

export type ToastAnimationState = 'default' | 'closing';

export type ToastType = 'warning' | 'info' | 'success';
