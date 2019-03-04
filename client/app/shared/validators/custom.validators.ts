import { ValidationErrors } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';

export class CustomValidators {
  static positiveInteger(control: AbstractControl): ValidationErrors | null {
    const input = Number(control.value);
    if (isNaN(input) || input < 1) {
      return { positiveInteger: true };
    }
    return null;
  }

  static oneOf = (options: Array<string | number>) => {
    return (control: AbstractControl) => {
      return options.includes(control.value) ? null : { oneOf: true };
    };
  };

  static requiredNonEmpty(control: AbstractControl): ValidationErrors | null {
    if (control.value === null) {
      return { required: true };
    }

    return control.value.trim() ? null : { required: true };
  }
}
