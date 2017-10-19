import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

// import { STATUS } from '../../../shared/constants';
import { AuthService } from '../../auth/auth.service';
// import { ErrorService } from '../../../shared/services';

import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';

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
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.key = this.route.snapshot.params['key'];
  }

  onSubmit(data) {
    this
      .authService
      .createInvitePassword(data)
      .subscribe(
        _ => this.handleSuccess(),
        err => { throw new Error(err) }
      );
  }

  handleSuccess() {
    this.isSubmitted = true;
    setTimeout(() => { this.router.navigate(['/login']); }, 1500);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: ALERT_DEFAULT });
  }

  ngOnInit() {
    if (!this.key) {
      this.router.navigate(['/login']);
      return;
    }

    this.form = this.fb.group({
      'admin_invite_key': [this.key, Validators.required],
      'new_password': [null, [Validators.required, Validators.minLength(6)]],
    });
  }
}
