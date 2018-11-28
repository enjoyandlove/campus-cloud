import { FormGroup } from '@angular/forms';

export const emptyForm = {
  school_id: 157,
  store_id: null,
  feed_url: null,
  feed_type: 1,
  poster_url: null,
  poster_thumb_url: null,
  sync_status: 0,
  last_successful_sync_epoch: null
};

const filledForm = {
  school_id: 157,
  store_id: 1,
  feed_url: 'http://some.data',
  feed_type: 1,
  poster_url: null,
  poster_thumb_url: null,
  sync_status: 1
};

export const fillForm = (form: FormGroup) => {
  for (const key in filledForm) {
    if (filledForm[key]) {
      form.get(key).setValue(filledForm[key]);
    }
  }

  return form;
};
