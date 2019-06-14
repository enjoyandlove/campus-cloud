import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { CPSession } from '../../../../../../../session';
import { ServicesModule } from '../../../services.module';
import { baseReducers } from '../../../../../../../store/base';
import { CPI18nService } from '../../../../../../../shared/services';
import { ServicesUtilsService } from '../../../services.utils.service';
import { EventUtilService } from '../../../../events/events.utils.service';
import { ServicesProvidersFormComponent } from './providers-form.component';

describe('ServicesProviderFormComponent', () => {
  let component: ServicesProvidersFormComponent;
  let fixture: ComponentFixture<ServicesProvidersFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ServicesModule,
        RouterTestingModule,
        StoreModule.forRoot({
          HEADER: baseReducers.HEADER,
          SNACKBAR: baseReducers.SNACKBAR
        })
      ],
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

  it('onSelectedQRCode', () => {
    let verificationMethods;

    component.onSelectedQRCode(false);

    verificationMethods = component.form.controls['checkin_verification_methods'].value;

    expect(verificationMethods).toEqual([1, 2]);

    component.onSelectedQRCode(true);

    verificationMethods = component.form.controls['checkin_verification_methods'].value;

    expect(verificationMethods).toEqual([1, 2, 3]);
  });
});
