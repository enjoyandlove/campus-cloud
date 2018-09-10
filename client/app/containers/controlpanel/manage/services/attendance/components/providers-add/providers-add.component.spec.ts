import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf, BehaviorSubject } from 'rxjs';

import { CPSession } from '../../../../../../../session';
import { ServicesModule } from '../../../services.module';
import { ProvidersService } from '../../../providers.service';
import { CPI18nService } from '../../../../../../../shared/services';
import { ServicesProviderAddComponent } from './providers-add.component';
import { EventUtilService } from '../../../../events/events.utils.service';

class MockService {
  dummy;

  createProvider(body: any, search: any) {
    this.dummy = [body, search];

    return observableOf({});
  }
}

const mockProvider = {
  has_checkout: false,
  provider_name: 'Hello World!',
  email: 'helloworld@gmail.com',
  checkin_verification_methods: [1, 2, 3],
  custom_basic_feedback_label: 'hello world'
};

describe('ServicesProviderAddComponent', () => {
  let spy;
  let component: ServicesProviderAddComponent;
  let fixture: ComponentFixture<ServicesProviderAddComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [ServicesModule, RouterTestingModule],
        providers: [
          CPSession,
          CPI18nService,
          EventUtilService,
          { provide: ProvidersService, useClass: MockService }]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ServicesProviderAddComponent);

          component = fixture.componentInstance;
          component.serviceWithFeedback = new BehaviorSubject(null);
          component.serviceWithFeedback.next(true);
          component.ngOnInit();
        });
    })
  );

  it('form validation should fail required fields missing', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should add service provider', () => {
    spyOn(component, 'trackEvent');
    spyOn(component.created, 'emit');
    spy = spyOn(component.providersService, 'createProvider')
      .and.returnValue(observableOf(mockProvider));

    component.serviceId = 1542;
    component.form.controls['email'].setValue(mockProvider.email);
    component.form.controls['has_checkout'].setValue(mockProvider.has_checkout);
    component.form.controls['provider_name'].setValue(mockProvider.provider_name);

    component.form.controls['checkin_verification_methods']
      .setValue(mockProvider.checkin_verification_methods);
    component.form.controls['custom_basic_feedback_label']
      .setValue(mockProvider.custom_basic_feedback_label);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalled();
    expect(component.created.emit).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalledWith(mockProvider);
  });

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
