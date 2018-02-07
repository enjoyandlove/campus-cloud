import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';
import { appStorage } from '../../../shared/utils';
import { AuthService } from '../auth.service';

import {
  CPI18nService,
  ErrorService,
  ZendeskService,
} from '../../../shared/services';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  goTo: string;
  form: FormGroup;
  logo = require('public/svg/full-logo.svg');

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
    public zendeskService: ZendeskService,
  ) {
    this.goTo = this.route.snapshot.queryParams['goTo'];
  }

  onSubmit(data) {
    if (!this.form.valid) {
      this.error.handleWarning({
        reason: this.cpI18n.translate('all_fields_are_required'),
      });

      return;
    }

    this.service.login(data.username, data.password).subscribe(
      (res) => {
        if (appStorage.storageAvailable()) {
          this.form.reset();

          appStorage.set(appStorage.keys.SESSION, res.id);

          if (this.goTo) {
            this.router.navigateByUrl(`/${decodeURIComponent(this.goTo)}`);

            return;
          }

          this.router.navigate(['/']);

          return;
        }
        console.warn('Local Storage is not supported');
      },
      (err) => {
        if (err.status === 401 || err.status === 403) {
          this.error.handleError({
            reason: this.cpI18n.translate('account_not_found'),
          });

          return;
        }
      },
    );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    this.zendeskService.setSuggestion('login');
  }
}
