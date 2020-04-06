import { AbstractControl, ValidationErrors } from '@angular/forms';

const required = { required: true };

export function validThread(control: AbstractControl): ValidationErrors | null {
  const message = control.get('message').value.trim();
  const imagesList = control.get('message_image_url_list').value;

  if (message.length > 0 || imagesList.length > 0) {
    return null;
  }

  return required;
}
