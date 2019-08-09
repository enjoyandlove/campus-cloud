import { InjectionToken, TemplateRef } from '@angular/core';

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

export type ToastType = 'warning' | 'info' | 'success';

export interface ToastConfig {
  position?: {
    top: number;
  };
  animation?: {
    fadeOut: number;
    fadeIn: number;
  };
}

export const defaultToastConfig: ToastConfig = {
  position: {
    top: 100
  },
  animation: {
    fadeOut: 300,
    fadeIn: 200
  }
};

export const TOAST_CONFIG_TOKEN = new InjectionToken('toast-config');
