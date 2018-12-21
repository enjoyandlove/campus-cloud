import { FormGroup, ValidationErrors } from '@angular/forms';

export class CustomTextValidators {
  static requiredNonEmpty(control: FormGroup): ValidationErrors | null {

    return control.value.trim() ? null : { required: true };
  }
}
