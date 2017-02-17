import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { STATUS } from '../../../shared/constants';
import { ErrorService } from '../../../shared/services';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';

@Component({
  selector: 'cp-callback-password-reset',
  templateUrl: './callback-password-reset.component.html',
  styleUrls: ['./callback-password-reset.component.scss']
})
export class CallbackPasswordResetComponent implements OnDestroy, OnInit {
  form: FormGroup;
  isSubmitted;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
  ) {
    this.form = this.fb.group({
      'newPassword': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.isSubmitted = true;

    if (!this.form.valid) {
      this.error.handleWarning({ reason: STATUS.ALL_FIELDS_ARE_REQUIRED });
      return;
    }
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() { }
}

