import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';
import { AuthService } from '../auth.service';

import { CPI18nService, ErrorService } from '../../../shared/services';

@Component({
  selector: 'cp-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss'],
})
export class LostPasswordComponent implements OnInit, OnDestroy {
  email;
  form: FormGroup;
  isSubmitted;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService,
    private cpI18n: CPI18nService,
  ) {
    this.form = this.fb.group({
      request_password_reset: [1],
      email: [null, [Validators.required]],
    });
  }

  onSubmit(data) {
    if (!this.form.valid) {
      this.error.handleWarning({
        reason: this.cpI18n.translate('all_fields_are_required'),
      });

      return;
    }

    this.email = data.email;

    this.service.submitPasswordReset(data).subscribe(
      () => (this.isSubmitted = true),
      () =>
        this.error.handleError({
          reason: this.cpI18n.translate('email_does_not_exist'),
        }),
    );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() {}
}
