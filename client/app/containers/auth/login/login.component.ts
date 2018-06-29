import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { appStorage } from '../../../shared/utils';
import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';
import {
  CPI18nService,
  CPTrackingService,
  ErrorService,
  ZendeskService
} from '../../../shared/services';
import { CPSession } from '../../../session';
import { amplitudeEvents } from '../../../shared/constants/analytics';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  buttonData;
  goTo: string;
  form: FormGroup;
  logo = require('public/svg/full-logo.svg');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private error: ErrorService,
    private service: AuthService,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private cpTracking: CPTrackingService,
    public zendeskService: ZendeskService
  ) {
    this.goTo = this.route.snapshot.queryParams['goTo'];
  }

  onSubmit(data) {
    if (!this.form.valid) {
      this.error.handleWarning({
        reason: this.cpI18n.translate('all_fields_are_required')
      });

      return;
    }

    this.service.login(data.username, data.password).subscribe(
      (res: any) => {
        if (appStorage.storageAvailable()) {
          this.form.reset();

          appStorage.set(appStorage.keys.SESSION, res.id);

          this.loadAndTrackAmplitudeEvent();

          if (this.goTo) {
            this.router.navigateByUrl(`/${decodeURIComponent(this.goTo)}`);

            return;
          }

          this.router.navigate(['/']);

          return;
        }
        this.error.handleError({
          reason: this.cpI18n.translate('error_allow_local_storage_to_continue')
        });
      },
      (err) => {
        if (err.status === 401 || err.status === 403) {
          this.error.handleError({
            reason: this.cpI18n.translate('account_not_found')
          });

          this.buttonData = { ...this.buttonData, disabled: false };

          return;
        }
      }
    );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  loadAndTrackAmplitudeEvent() {
    this.cpTracking.loadAmplitude(this.session.g);
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.LOGGED_IN);
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary w-100',
      text: this.cpI18n.translate('login')
    };

    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });

    this.zendeskService.setHelpCenterSuggestions({ search: 'login' });
  }
}
