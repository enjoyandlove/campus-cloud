import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { of as observableOf } from 'rxjs';

import { CPSession } from '../../../../../../../session';
import { ServicesModule } from '../../../services.module';
import { ProvidersService } from '../../../providers.service';
import { baseReducers } from '../../../../../../../store/base';
import { CPI18nService } from '../../../../../../../shared/services';
import { ServicesUtilsService } from '../../../services.utils.service';
import { ServicesProviderAddComponent } from './providers-add.component';

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
        imports: [
          ServicesModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: baseReducers.HEADER,
            SNACKBAR: baseReducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          ServicesUtilsService,
          { provide: ProvidersService, useClass: MockService }
        ]
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(ServicesProviderAddComponent);

          component = fixture.componentInstance;
          component.service = {
            ...component.service,
            id: 1253
          };

          fixture.detectChanges();
        });
    })
  );

  it('form validation should fail required fields missing', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should add service provider', () => {
    spyOn(component, 'trackEvent');
    spyOn(component.created, 'emit');
    spy = spyOn(component.providersService, 'createProvider').and.returnValue(
      observableOf(mockProvider)
    );

    component.form.controls['email'].setValue(mockProvider.email);
    component.form.controls['has_checkout'].setValue(mockProvider.has_checkout);
    component.form.controls['provider_name'].setValue(mockProvider.provider_name);

    component.form.controls['checkin_verification_methods'].setValue(
      mockProvider.checkin_verification_methods
    );
    component.form.controls['custom_basic_feedback_label'].setValue(
      mockProvider.custom_basic_feedback_label
    );

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalled();
    expect(component.created.emit).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalledWith(mockProvider);
  });
});
