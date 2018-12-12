import { FormGroup } from '@angular/forms';

const filledForm = {
  phone: 125488,
  category_id: 1,
  city: 'Karachi',
  province: 'Sindh',
  short_name: 'LMC',
  latitude: 78584585,
  country: 'Pakistan',
  name: 'Hello World!',
  postal_code: '74000',
  longitude: -45857858,
  image_url: 'thumb.jpeg',
  address: 'Clifton Block #04',
  description: 'test description',
  email: 'test@oohlalamobile.com'
};

export const fillForm = (form: FormGroup) => {
  for (const key in filledForm) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};
