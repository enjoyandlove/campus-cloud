import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

import { DateStatus } from './deals.service';

export const dealOngoingValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const expiration = control.get('expiration').value;
  const ongoing = control.get('ongoing').value;
  const expirationValid = ongoing ? expiration === DateStatus.forever : expiration > 0;

  return expirationValid ? null : { 'datesInvalid': true };
};
