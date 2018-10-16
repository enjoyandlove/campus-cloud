import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';
import { StoreModule } from '@ngrx/store';

import { reducers } from '../../../../../../../reducers';
import { CPSession } from '../../../../../../../session';
import { ServicesModule } from '../../../services.module';
import { ProvidersService } from '../../../providers.service';
import { CPI18nService } from '../../../../../../../shared/services';
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

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [
          ServicesModule,
          RouterTestingModule,
          StoreModule.forRoot({
            HEADER: reducers.HEADER,
            SNACKBAR: reducers.SNACKBAR
          })
        ],
        providers: [
          CPSession,
          CPI18nService,
          ServicesUtilsService,
          { provide: ProvidersService, useClass: MockService }]
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

          component.ngOnInit();
        });
    })
  );

  it('form validation should fail required fields missing', () => {
    component.form.controls['email'].setValue(null);
    component.form.controls['provider_name'].setValue(null);

    expect(component.form.valid).toBe(false);
  });

  it('should update service provider', () => {
    spyOn(component.edited, 'emit');
    spy = spyOn(component.providersService, 'updateProvider')
      .and.returnValue(observableOf(mockProvider));

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalled();
    expect(component.edited.emit).toHaveBeenCalledTimes(1);
    expect(component.edited.emit).toHaveBeenCalledWith(mockProvider);
  });
});
