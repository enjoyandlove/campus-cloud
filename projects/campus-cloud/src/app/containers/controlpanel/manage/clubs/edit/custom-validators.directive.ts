import { AbstractControl, ValidatorFn } from '@angular/forms';

export function advisorDataRequired(isSJSU): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isBlank = control.value === '' || control.value === null;

    const required = isSJSU ? isBlank : false;

    return required ? { required: true } : null;
  };
}
