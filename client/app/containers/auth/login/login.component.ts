import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { AuthService } from '../auth.service';
import { appStorage } from '../../../shared/utils';
import { STATUS } from '../../../shared/constants';
import { ErrorService } from '../../../shared/services';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
    private route: ActivatedRoute
  ) {
    this.goTo = this.route.snapshot.queryParams['goTo'];
  }

  onSubmit(data) {
    if (!this.form.valid) {
      this.error.handleWarning({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }

    this
      .service
      .login(data.username, data.password)
      .subscribe(
      res => {
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
      err => {
        if (err.status === 401) {
          this.error.handleError({ reason: STATUS.NO_ACCOUNT_FOUND });
          return;
        }
        console.error(err.json());
      }
      );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() {
    this.form = this.fb.group({
      'username': [null, [Validators.required]],
      'password': [null, [Validators.required]],
    });
  }
}
