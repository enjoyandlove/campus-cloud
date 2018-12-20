import { FormGroup } from '@angular/forms';

export const fillForm = (form: FormGroup, filledForm) => {
  for (const key in filledForm) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};
