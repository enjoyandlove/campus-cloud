import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

import { CPDate } from '../../../../shared/utils';

export const dealDateValidator = (tz: string): ValidatorFn => {
  return (control: FormGroup): ValidationErrors | null => {
    const ongoing = control.get('ongoing').value;
    if (ongoing) {
      return null;
    }

    const start = control.get('start').value;
    const expiration = control.get('expiration').value;
    const now = Math.round(CPDate.now(tz).unix());
    const expirationExists = expiration > 0;

    return !expirationExists
      ? { expirationInvalid: true }
      : expirationError(start, expiration, now);
  };
};

const expirationError = (start: number, expiration: number, now: number) => {
  return expiration < now
    ? { expirationBeforeNow: true }
    : expiration < start
    ? { expirationBeforeStart: true }
    : null;
};
