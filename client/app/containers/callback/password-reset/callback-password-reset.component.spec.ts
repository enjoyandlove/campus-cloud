/*tslint:disable:max-classes-per-file */
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { StoreModule } from '@ngrx/store';

import {
  TestBed,
  async,
  fakeAsync,
  ComponentFixture
} from '@angular/core/testing';

import { AuthService } from './../../auth/auth.service';
import { CPI18nService } from '../../../shared/services';
import { FormsModule, FormBuilder } from '@angular/forms';
import { ALERT_DEFAULT } from '../../../reducers/alert.reducer';
import { ErrorService } from './../../../shared/services/error.service';
import { CallbackPasswordResetComponent } from './callback-password-reset.component';

class RouterMock {
    navigate() {
      // console.log('navigating');
    }
}

class MockAuthService {
  submitPasswordReset(_) {
    return Observable.of(true);
  }
}

class MockActivatedRoute {
  snapshot = {
    params: {
      'key': 123
    }
  };
}

describe('Password Reset', () => {
  let spyError;
  let spySubmit;
  let errorService: ErrorService;
  let authService: AuthService;
  let comp: CallbackPasswordResetComponent;
  let fixture: ComponentFixture<CallbackPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
     imports: [
       FormsModule,
       StoreModule.forRoot({ 'ALERT': ALERT_DEFAULT }),
     ],
     declarations: [ CallbackPasswordResetComponent ],
     providers: [
      FormBuilder,
      CPI18nService,
      ErrorService,
      { provide: ActivatedRoute, useClass: MockActivatedRoute },
      { provide: AuthService, useClass: MockAuthService },
      { provide: Router, useClass: RouterMock},
     ]
   })
   .overrideComponent(CallbackPasswordResetComponent, {
     set: {
       template: '<div>No Template</div>'
     }
   })
   .compileComponents();
 }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CallbackPasswordResetComponent);
    comp = fixture.componentInstance;
    errorService = TestBed.get(ErrorService);
    authService = TestBed.get(AuthService);

    spyError = spyOn(errorService, 'handleError');
    spySubmit = spyOn(authService, 'submitPasswordReset').and.returnValue(Observable.of(true));
 });

  it('Should read Key from url', fakeAsync(() => {
    expect(comp.isSubmitted).toBeFalsy();
    expect(comp.key.toString()).toBe('123');
  }));

  it('should call error handler on missing password', () => {
    const new_password = 123456;
    const confirm_password = 1234567;

    comp.form.controls['new_password'].setValue(new_password);
    comp.form.controls['confirmPassword'].setValue(confirm_password);

    comp.onSubmit({new_password, confirm_password});

    expect(spyError).toHaveBeenCalled();
    expect(spySubmit).not.toHaveBeenCalled();
  });

  it('should handle success', () => {
    const new_password = 123456;
    const confirm_password = 123456;

    comp.form.controls['new_password'].setValue(new_password);
    comp.form.controls['confirmPassword'].setValue(confirm_password);

    comp.onSubmit({new_password, confirm_password});
    expect(comp.isSubmitted).toBeDefined();
    expect(spyError).not.toHaveBeenCalled();
    expect(spySubmit).toHaveBeenCalled();
  });
});
