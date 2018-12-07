import { FormGroup } from '@angular/forms';

import { filledForm } from './mocks';

export const fillForm = (form: FormGroup) => {
  for (const key in filledForm) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};
