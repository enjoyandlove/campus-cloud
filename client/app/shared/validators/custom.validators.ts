import { AbstractControl, ValidationErrors, FormControl } from '@angular/forms';

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

  static commaSeparated = (validator: Function) => {
    return (control: AbstractControl) => {
      if (control.value === null) {
        return { required: true };
      }
      const separated = control.value.split(',');
      return separated
        .map((value: string) => value.trim())
        .reduce((errors: ValidationErrors | null, value: string) => {
          if (value) {
            return {
              ...errors,
              ...validator(new FormControl(value))
            };
          }
          return errors;
        }, null);
    };
  };
}
