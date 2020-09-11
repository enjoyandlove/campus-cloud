import { TestBed } from '@angular/core/testing';

import { SelfCheckInCallbackService } from './self-check-in-callback.service';

describe('SelfCheckInCallbackService', () => {
  let service: SelfCheckInCallbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelfCheckInCallbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
