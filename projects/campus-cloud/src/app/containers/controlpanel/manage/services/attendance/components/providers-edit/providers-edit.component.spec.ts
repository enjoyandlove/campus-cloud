import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of as observableOf } from 'rxjs';

import { ServicesModule } from '../../../services.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { ProvidersService } from '../../../providers.service';
import { ServicesUtilsService } from '../../../services.utils.service';
import { ServiceProvidersEditComponent } from './providers-edit.component';

class MockService {
  dummy;

  updateProvider(body: any, providerId: number, search: any) {
    this.dummy = [body, providerId, search];

    return observableOf({});
  }
}

const mockProvider = {
  has_checkout: false,
  has_feedback: true,
  provider_name: 'Hello World!',
  email: 'helloworld@gmail.com',
  checkin_verification_methods: [1, 2, 3],
  custom_basic_feedback_label: 'hello world'
};

describe('ServicesProviderUpdateComponent', () => {
  let spy;
  let component: ServiceProvidersEditComponent;
  let fixture: ComponentFixture<ServiceProvidersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, ServicesModule, RouterTestingModule],
      providers: [ServicesUtilsService, { provide: ProvidersService, useClass: MockService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ServiceProvidersEditComponent);

        component = fixture.componentInstance;
        component.service = {
          ...component.service,
          id: 1253
        };

        component.provider = {
          ...component.provider,
          ...mockProvider
        };

        fixture.detectChanges();
      });
  }));

  it('form validation should fail required fields missing', () => {
    component.form.controls['email'].setValue(null);
    component.form.controls['provider_name'].setValue(null);

    expect(component.form.valid).toBe(false);
  });

  it('should update service provider', () => {
    spyOn(component.edited, 'emit');
    spy = spyOn(component.providersService, 'updateProvider').and.returnValue(
      observableOf(mockProvider)
    );

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalled();
    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(mockProvider);
  });
});
