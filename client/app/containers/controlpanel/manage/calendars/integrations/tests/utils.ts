import { FormGroup } from '@angular/forms';

import { filledForm } from './mocks';

export const fillForm = (form: FormGroup) => {
  const f = { ...filledForm };
  for (const key in f) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};

export const resetForm = (form: FormGroup) => {
  const f = { ...filledForm };
  for (const key in f) {
    if (filledForm[key]) {
      form.get(key).setValue(null);
    }
  }

  return form;
};
