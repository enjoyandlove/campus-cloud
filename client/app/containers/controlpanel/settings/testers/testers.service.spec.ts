import { TestBed } from '@angular/core/testing';

import { TestersService } from './testers.service';

describe('TestersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestersService = TestBed.get(TestersService);
    expect(service).toBeTruthy();
  });
});
