import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { CPSession } from '@campus-cloud/session';
import { QrModule } from '../qr.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { CPI18nService } from '@campus-cloud/shared/services';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { QrFormComponent } from './qr-form.component';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

describe('QrFormComponent', () => {
  let component: QrFormComponent;
  let fixture: ComponentFixture<QrFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, QrModule, RouterTestingModule],
      providers: [CPSession, CPI18nService, EventUtilService, ServicesUtilsService]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QrFormComponent);

        component = fixture.componentInstance;
        component.form = component.serviceUtils.getQrProviderForm(null);
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
