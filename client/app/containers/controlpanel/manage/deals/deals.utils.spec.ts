import { FormBuilder, ValidatorFn } from '@angular/forms';

import { dealDateValidator } from './deals.utils';
import mockSession from '../../../../session/mock/session';

describe('DealsUtils', () => {
  const session = mockSession;
  const validator: ValidatorFn = dealDateValidator(session.tz);
  const formBuilder = new FormBuilder();

  it('should validate dates', () => {
    const formGroup = formBuilder.group({
      start: [0],
      expiration: [1],
      ongoing: [true]
    });
    expect(validator(formGroup)).toBe(null);
  });
  it('should throw expirationBeforeNow', () => {
    const formGroup = formBuilder.group({
      start: [0],
      expiration: [1],
      ongoing: [false]
    });
    expect(validator(formGroup)).toEqual({ expirationBeforeNow: true });
  });
  it('should throw expirationBeforeStart', () => {
    const formGroup = formBuilder.group({
      start: [9_999_999_999],
      expiration: [9_999_999_990],
      ongoing: [false]
    });
    expect(validator(formGroup)).toEqual({ expirationBeforeStart: true });
  });
  it('should throw expirationInvalid', () => {
    const formGroup = formBuilder.group({
      start: [0],
      expiration: null,
      ongoing: [false]
    });
    expect(validator(formGroup)).toEqual({ expirationInvalid: true });
  });
});
