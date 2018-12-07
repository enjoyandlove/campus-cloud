import { FormGroup } from '@angular/forms';

import { filledIntegrationForm } from './mocks';

export const fillForm = (form: FormGroup) => {
  const f = { ...filledIntegrationForm };
  for (const key in f) {
    if (f[key]) {
      form.get(key).setValue(f[key]);
    }
  }

  return form;
};

export const resetForm = (form: FormGroup) => {
  const f = { ...filledIntegrationForm };
  for (const key in f) {
    if (f[key]) {
      form.get(key).setValue(null);
    }
  }

  return form;
};
