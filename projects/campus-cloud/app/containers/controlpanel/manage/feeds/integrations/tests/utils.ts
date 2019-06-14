import { AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { filledForm } from './mocks';

export const fillForm = (form: FormGroup | AbstractControl, nestedKey = null) => {
  Object.keys(form.value).forEach((key) => {
    if (form.get(key) instanceof FormGroup) {
      return fillForm(form.get(key), key);
    }

    const formValue = nestedKey ? filledForm[nestedKey][key] : filledForm[key];

    form.get(key).setValue(formValue);
  });
};

export const resetForm = (form: FormGroup | AbstractControl) => {
  Object.keys(form.value).forEach((key) => {
    if (form.get(key) instanceof FormGroup) {
      return resetForm(form.get(key));
    }

    form.get(key).setValue(null);
  });

  return form;
};
