import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { STATUS } from '../../../shared/constants';
import { AuthService } from '../../auth/auth.service';
import { ErrorService } from '../../../shared/services';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';

@Component({
  selector: 'cp-callback-password-reset',
  templateUrl: './callback-password-reset.component.html',
  styleUrls: ['./callback-password-reset.component.scss']
})
export class CallbackPasswordResetComponent implements OnDestroy, OnInit {
  key: string;
  form: FormGroup;
  isSubmitted;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService,
    private route: ActivatedRoute
  ) {
    this.key = this.route.snapshot.params['key'];

    this.form = this.fb.group({
      'new_password': [null,
      Validators.compose([Validators.required, Validators.minLength(6)])
      ],
      'password_reset_key': [this.key],
      'confirmPassword': [null,
      Validators.compose([Validators.required, Validators.minLength(6)])
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
      this.error.handleError({ reason: STATUS.PASSWORDS_DO_NOT_MATCH });
      return;
    }

    this
      .service
      .submitPasswordReset(body)
      .subscribe(
        _ => this.handleSuccess(),
        _ => this.error.handleError({ reason: STATUS.SOMETHING_WENT_WRONG })
      );
  }

  handleSuccess() {
    this.isSubmitted = true;
    setTimeout(() => { this.router.navigate(['/login']); }, 1500);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() { }
}

