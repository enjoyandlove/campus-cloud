import { TestBed } from '@angular/core/testing';
import { Overlay } from '@angular/cdk/overlay';

import { ToastService } from './toast.service';
import { defaultToastConfig } from '../config';
import { TOAST_CONFIG_TOKEN } from './../config/tokens';

describe('ToastService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [Overlay, { provide: TOAST_CONFIG_TOKEN, useValue: defaultToastConfig }]
    })
  );

  it('should be created', () => {
    const service: ToastService = TestBed.get(ToastService);
    expect(service).toBeTruthy();
  });
});
