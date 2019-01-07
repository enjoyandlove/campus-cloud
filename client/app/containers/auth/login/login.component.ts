import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { appStorage } from '@shared/utils';

import { AuthService } from '../auth.service';
import { baseActions } from '@app/store/base';
import { environment } from '@client/environments/environment';
import { LayoutWidth, LayoutAlign } from '@app/layouts/interfaces';
import { CPI18nService, ErrorService, ZendeskService } from '@shared/services';

@Component({
  selector: 'cp-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  buttonData;
  goTo: string;
  form: FormGroup;
  logo = `${environment.root}public/svg/full-logo.svg`;
  layoutWidth = LayoutWidth.fourth;
  layoutAlign = LayoutAlign.center;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private error: ErrorService,
    private service: AuthService,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
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
          const setUserLoginState: NavigationExtras = {
            queryParams: { login: true }
          };

          this.form.reset();

          appStorage.set(appStorage.keys.SESSION, res.id);

          if (this.goTo) {
            this.router.navigate([`/${decodeURIComponent(this.goTo)}`], setUserLoginState);

            return;
          }

          this.router.navigate(['/dashboard'], setUserLoginState);

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
    this.store.dispatch({ type: baseActions.ALERT_DEFAULT });
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
