import { FormGroup, ValidationErrors } from '@angular/forms';
import { trim as _trim } from 'lodash';

export class CustomValidators {
  static textInputValidator(control: FormGroup): ValidationErrors | null {

    return _trim(control.value) ? null : { required: true };
  }
}
