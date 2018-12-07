import { FormGroup } from '@angular/forms';

import { filledForm } from './mocks';

export const fillForm = (form: FormGroup) => {
  const f = { ...filledForm };
  for (const key in f) {
    if (f[key]) {
      form.get(key).setValue(f[key]);
    }
  }

  return form;
};

export const resetForm = (form: FormGroup) => {
  const f = { ...filledForm };
  for (const key in f) {
    if (f[key]) {
      form.get(key).setValue(null);
    }
  }

  return form;
};
