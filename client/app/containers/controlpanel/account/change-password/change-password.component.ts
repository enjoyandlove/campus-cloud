import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../session';
import { AccountService } from '../account.service';
import { baseActions, IAlert } from '../../../../store/base';
import { amplitudeEvents } from '../../../../shared/constants/analytics';
import { CPI18nService } from './../../../../shared/services/i18n.service';
import { CPTrackingService, ErrorService } from '../../../../shared/services';

@Component({
  selector: 'cp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  pageHeader;
  form: FormGroup;
  isCompleted = false;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IAlert>,
    private cpI18n: CPI18nService,
    private errorService: ErrorService,
    private cpTracking: CPTrackingService,
    private accountService: AccountService
  ) {
    this.form = this.fb.group({
      current: [null, [Validators.required, Validators.minLength(6)]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      confirmation: [
        null,
        [Validators.required, Validators.minLength(6), this.passwordsMatch.bind(this)]
      ]
    });
  }

  onSubmit(data) {
    this.store.dispatch({ type: baseActions.ALERT_DEFAULT });

    if (!this.form.valid) {
      if (this.form.controls['current'].errors) {
        if (this.form.controls['current'].errors['required']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('all_fields_are_required')
          });

          return;
        }
        if (this.form.controls['current'].errors['minlength']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('validate_password_min_length')
          });

          return;
        }
      }

      if (this.form.controls['password'].errors) {
        if (this.form.controls['password'].errors['required']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('all_fields_are_required')
          });

          return;
        }
        if (this.form.controls['password'].errors['minlength']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('validate_password_min_length')
          });

          return;
        }
      }

      if (this.form.controls['confirmation'].errors) {
        if (this.form.controls['confirmation'].errors['required']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('all_fields_are_required')
          });

          return;
        }
        if (this.form.controls['confirmation'].errors['minlength']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('validate_password_min_length')
          });

          return;
        }
        if (this.form.controls['confirmation'].errors['passwordsMatch']) {
          this.errorService.handleError({
            reason: this.cpI18n.translate('passwords_do_not_match')
          });

          return;
        }
      }

      return;
    }

    const body = {
      current_password: data.current,
      new_password: data.password
    };

    this.accountService
      .resetPassword(body, this.session.g.get('user').id)
      .toPromise()
      .then((_) => {
        this.form.reset();
        this.isCompleted = true;
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.CHANGE_PASSWORD);
      });
  }

  passwordsMatch() {
    if (this.form) {
      const password = this.form.controls['password'].value;
      const confirmation = this.form.controls['confirmation'].value;

      if (password === confirmation) {
        return;
      }

      return { passwordsMatch: true };
    }
  }

  ngOnInit() {
    this.pageHeader = {
      heading: 'change_password',
      crumbs: {
        url: null,
        label: null
      },
      subheading: null,
      em: null,
      children: []
    };
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.ALERT_DEFAULT });
  }
}
