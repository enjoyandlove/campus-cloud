import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { STATUS } from '../../../shared/constants';
import { ErrorService } from '../../../shared/services';
import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';


@Component({
  selector: 'cp-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnDestroy {
  email;
  form: FormGroup;
  isSubmitted;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService
  ) {
    this.form = this.fb.group({
      'request_password_reset': [1],
      'email': [null, [Validators.required]],
    });
  }

  onSubmit(data) {
    if (!this.form.valid) {
      this.error.handleWarning({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }

    this.email = data.email;

    this
      .service
      .submitPasswordReset(data)
      .subscribe(
        () => this.isSubmitted = true,
        () => this.error.handleError({ reason: STATUS.EMAIL_DOES_NOT_EXIST })
      );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() { }
}
