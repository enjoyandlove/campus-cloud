import { FormGroup, ValidationErrors } from '@angular/forms';

export class CustomTextValidators {
  static requiredNonEmpty(control: FormGroup): ValidationErrors | null {

    if (control.value === null) {
      return { required: true };
    }

    return control.value.trim() ? null : { required: true };
  }
}
