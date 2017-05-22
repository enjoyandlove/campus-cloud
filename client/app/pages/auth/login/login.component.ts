import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
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
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService
  ) {
    this.form = this.fb.group({
      'username': [null, [Validators.required]],
      'password': [null, [Validators.required]],
    });
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

  ngOnInit() { }
}
