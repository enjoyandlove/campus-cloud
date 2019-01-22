import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { baseActions } from '../../../store/base/';
import { AuthService } from '../../auth/auth.service';
import { amplitudeEvents } from '../../../shared/constants/analytics';

import {
  ErrorService,
  CPI18nService,
  CPTrackingService,
  CPAmplitudeService
} from '../../../shared/services';

const ERROR_STRINGS = {
  default: 'admin_invite_invalid_invite_key_error',
  409: 't_admin_invite_already_activated_error',
  410: 't_admin_invite_account_error'
};

@Component({
  selector: 'cp-admin-invite',
  templateUrl: './admin-invite.component.html',
  styleUrls: ['./admin-invite.component.scss']
})
export class AdminInviteComponent implements OnInit, OnDestroy {
  key: string;
  isSubmitted;
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cpTracking: CPTrackingService,
    private cpAmplitude: CPAmplitudeService
  ) {
    this.key = this.route.snapshot.params['key'];
  }

  onSubmit(data) {
    this.authService.createInvitePassword(data).subscribe(
      (_) => this.handleSuccess(),
      (error: HttpErrorResponse) => {
        this.error.handleError({
          reason: this.cpI18n.translate(ERROR_STRINGS[error.status] || ERROR_STRINGS.default)
        });
      }
    );
  }

  handleSuccess() {
    this.trackAmplitudeEvent();
    this.isSubmitted = true;
    setTimeout(
      () => {
        this.router.navigate(['/login']);
      },

      1500
    );
  }

  trackAmplitudeEvent() {
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.CREATED_ACCOUNT);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.ALERT_DEFAULT });
  }

  ngOnInit() {
    this.cpAmplitude.loadAmplitude();

    if (!this.key) {
      this.router.navigate(['/login']);

      return;
    }

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.CREATE_ACCOUNT_PAGE);

    this.form = this.fb.group({
      admin_invite_key: [this.key, Validators.required],
      new_password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }
}
