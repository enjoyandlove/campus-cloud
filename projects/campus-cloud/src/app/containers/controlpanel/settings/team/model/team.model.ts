import { FormBuilder, Validators } from '@angular/forms';

export class TeamModel {
  static form(user?) {
    const fb = new FormBuilder();
    const _user = {
      email: user ? user.email : null,
      lastname: user ? user.lastname : null,
      firstname: user ? user.firstname : null
    };

    return fb.group({
      email: [_user.email, Validators.required],
      lastname: [_user.lastname, Validators.required],
      firstname: [_user.firstname, Validators.required]
    });
  }
}
