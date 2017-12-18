import { ValidatorFn } from '@angular/forms/src/directives/validators';
import { AbstractControl } from '@angular/forms/src/model';

export function advisorDataRequired(isSJSU): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    let isBlank = control.value === '' || control.value === null;

    let required = isSJSU ? isBlank : false;

    return required ? { 'required': true } : null
  };
}
