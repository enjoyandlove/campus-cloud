import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AccountService } from '../account.service';
import { ErrorService } from '../../../../shared/services';
import { STATUS } from '../../../../shared/constants/status';
import { ALERT_DEFAULT, IAlert } from '../../../../reducers/alert.reducer';

@Component({
  selector: 'cp-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  pageHeader;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<IAlert>,
    private errorService: ErrorService,
    private accountService: AccountService
  ) {
    this.form = this.fb.group({
      'current': ['', [
        Validators.required,
        Validators.minLength(6)
      ]
      ],
      'password': ['', [
        Validators.required,
        Validators.minLength(6)
      ]
      ],
      'confirmation': ['', [
        Validators.required,
        Validators.minLength(6),
        this.passwordsMatch.bind(this)
      ]
      ],
    });
  }

  onSubmit(data) {
    this.store.dispatch({ type: ALERT_DEFAULT });

    if (!this.form.valid) {
      if (this.form.controls['current'].errors) {
        if (this.form.controls['current'].errors['required']) {
          this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
          return;
        }
        if (this.form.controls['current'].errors['minlength']) {
          this.errorService.handleError({ reason: STATUS.PASSWORD_MIN_LENGTH });
          return;
        }
      }

      if (this.form.controls['password'].errors) {
        if (this.form.controls['password'].errors['required']) {
          this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
          return;
        }
        if (this.form.controls['password'].errors['minlength']) {
          this.errorService.handleError({ reason: STATUS.PASSWORD_MIN_LENGTH });
          return;
        }
      }

      if (this.form.controls['confirmation'].errors) {
        if (this.form.controls['confirmation'].errors['required']) {
          this.errorService.handleError({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
          return;
        }
        if (this.form.controls['confirmation'].errors['minlength']) {
          this.errorService.handleError({ reason: STATUS.PASSWORD_MIN_LENGTH });
          return;
        }
        if (this.form.controls['confirmation'].errors['passwordsMatch']) {
          this.errorService.handleError({ reason: STATUS.PASSWORDS_DO_NOT_MATCH });
          return;
        }
      }
      return;
    }

    this
      .accountService
      .resetPassword(data.current, data.password)
      .then(res => {
        this.form.reset();
        console.log(res);
      });
  }

  passwordsMatch() {
    if (this.form) {
      let password = this.form.controls['password'].value;
      let confirmation = this.form.controls['confirmation'].value;

      if (password === confirmation) {
        return;
      }

      return { passwordsMatch: true };
    }
  }

  ngOnInit() {
    this.pageHeader = {
      'heading': 'Change Password',
      'subheading': null,
      'em': null,
      'children': [],
    };
  }
}

