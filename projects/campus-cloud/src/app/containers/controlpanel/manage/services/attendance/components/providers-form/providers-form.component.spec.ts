import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPSession } from '@campus-cloud/session';
import { ServicesModule } from '../../../services.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '../../../services.utils.service';
import { EventUtilService } from '../../../../events/events.utils.service';
import { ServicesProvidersFormComponent } from './providers-form.component';
import {
  CheckInMethod,
  SelfCheckInOption
} from '@controlpanel/manage/events/event.status';

describe('ServicesProviderFormComponent', () => {
  let component: ServicesProvidersFormComponent;
  let fixture: ComponentFixture<ServicesProvidersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, ServicesModule, RouterTestingModule],
      providers: [CPSession, CPI18nService, EventUtilService, ServicesUtilsService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ServicesProvidersFormComponent);

        component = fixture.componentInstance;
        component.form = component.serviceUtils.getProviderForm(null);
      });
  }));

  it('onSelectedAttendanceType', () => {
    component.onSelectedAttendanceType(false);

    expect(component.form.controls['has_checkout'].value).toBe(false);

    component.onSelectedAttendanceType(true);

    expect(component.form.controls['has_checkout'].value).toBe(true);
  });

  it('onSelectedCheckInMethods', () => {
    let verificationMethods;

    component.onSelectedCheckInMethods([SelfCheckInOption.appLink, SelfCheckInOption.qr]);

    verificationMethods = component.form.controls['checkin_verification_methods'].value;

    expect(verificationMethods).toEqual([CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.deepLink, CheckInMethod.app]);

    component.onSelectedCheckInMethods([SelfCheckInOption.appLink, SelfCheckInOption.qr, SelfCheckInOption.email]);

    verificationMethods = component.form.controls['checkin_verification_methods'].value;

    expect(verificationMethods).toEqual([CheckInMethod.web, CheckInMethod.webQr,
      CheckInMethod.deepLink, CheckInMethod.app, CheckInMethod.userWebEntry]);
  });
});
