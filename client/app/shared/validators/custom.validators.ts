import { AbstractControl, ValidationErrors, FormControl, Validators } from '@angular/forms';

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

  static commaSeparated = (validators: Function[]) => {
    return (control: AbstractControl) => {
      const hasValue = control.value && control.value.replace(/,/g, '').length;
      if (!hasValue) {
        return { required: true };
      }
      const separated = control.value.split(',');
      return separated
        .map((value: string) => value.trim())
        .reduce((valueErrors: ValidationErrors | null, value: string) => {
          return validators.reduce(
            (validatorErrors: ValidationErrors | null, validator: Function) => {
              return {
                ...validatorErrors,
                ...validator(new FormControl(value))
              };
            },
            valueErrors
          );
        }, null);
    };
  };

  static emailWithTopLevelDomain(control: AbstractControl): ValidationErrors | null {
    const emailErrors = Validators.email(control);
    if (emailErrors) {
      return emailErrors;
    }
    const domain = control.value.split('@')[1];
    const validDomain = /([A-Z0-9]+\.)+[A-Z0-9]+/i;
    const isValid = validDomain.test(domain);
    if (!isValid) {
      return { topLevelDomain: true };
    }
    return null;
  }
}
