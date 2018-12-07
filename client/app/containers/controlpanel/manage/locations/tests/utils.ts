import { FormGroup } from '@angular/forms';

const filledForm = {
  city: 'Karachi',
  province: 'Sindh',
  short_name: 'LMC',
  latitude: 78584585,
  country: 'Pakistan',
  name: 'Hello World!',
  postal_code: '74000',
  longitude: -45857858,
  address: 'Clifton Block #04'
};

export const fillForm = (form: FormGroup) => {
  for (const key in filledForm) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};
