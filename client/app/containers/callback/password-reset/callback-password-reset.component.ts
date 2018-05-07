import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';
import { AuthService } from '../../auth/auth.service';

import { CPI18nService, ErrorService } from '../../../shared/services';

@Component({
  selector: 'cp-callback-password-reset',
  templateUrl: './callback-password-reset.component.html',
  styleUrls: ['./callback-password-reset.component.scss'],
})
export class CallbackPasswordResetComponent implements OnDestroy, OnInit {
  key: string;
  form: FormGroup;
  isSubmitted = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService,
    private route: ActivatedRoute,
    private cpI18n: CPI18nService,
  ) {
    this.key = this.route.snapshot.params['key'];

    this.form = this.fb.group({
      new_password: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
      password_reset_key: [this.key],
      confirmPassword: [
        null,
        Validators.compose([Validators.required, Validators.minLength(6)]),
      ],
    });

    if (!this.key) {
      this.router.navigate(['/login']);

      return;
    }
  }

  onSubmit(body) {
    this.store.dispatch({ type: ALERT_DEFAULT });

    const new_password = this.form.controls['new_password'];
    const confirmPassword = this.form.controls['confirmPassword'];

    if (new_password.value !== confirmPassword.value || !this.form.valid) {
      this.error.handleError({
        reason: this.cpI18n.translate('passwords_do_not_match'),
      });

      return;
    }

    this.service.submitPasswordReset(body).subscribe(
      (_) => this.handleSuccess(),
      (_) =>
        this.error.handleError({
          reason: this.cpI18n.translate('something_went_wrong'),
        }),
    );
  }

  handleSuccess() {
    this.isSubmitted = true;
    setTimeout(
      () => {
        this.router.navigate(['/login']);
      },

      1500,
    );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() {}
}
