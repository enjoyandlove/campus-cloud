import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth.service';
import { appStorage } from '../../../shared/utils';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private service: AuthService
  ) {

    this.form = this.fb.group({
      'username': ['', [Validators.required]],
      'password': ['', [Validators.required]],
    });
  }

  onSubmit(data) {
    if (!this.form.valid) { return; }

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
            console.warn('Not Authorized');
            return;
          }
          console.error(err.json());
        }
      );
  }

  ngOnInit() { }
}
