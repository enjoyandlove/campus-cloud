import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { baseActions } from '../../../store/base';
import { amplitudeEvents } from '../../../shared/constants/analytics';

import {
  ErrorService,
  CPI18nService,
  CPTrackingService,
  CPAmplitudeService
} from '../../../shared/services';

@Component({
  selector: 'cp-lost-password',
  templateUrl: './lost-password.component.html',
  styleUrls: ['./lost-password.component.scss']
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
    private cpTracking: CPTrackingService,
    private cpAmplitude: CPAmplitudeService
  ) {
    this.form = this.fb.group({
      request_password_reset: [1],
      email: [null, [Validators.required]]
    });
  }

  onSubmit(data) {
    if (!this.form.valid) {
      this.error.handleWarning({
        reason: this.cpI18n.translate('all_fields_are_required')
      });

      return;
    }

    this.email = data.email;

    this.service.submitPasswordReset(data).subscribe(
      () => {
        this.isSubmitted = true;
        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.RESET_PASSWORD);
      },
      () =>
        this.error.handleError({
          reason: this.cpI18n.translate('email_does_not_exist')
        })
    );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.ALERT_DEFAULT });
  }

  ngOnInit() {
    this.cpAmplitude.loadAmplitude();
  }
}
