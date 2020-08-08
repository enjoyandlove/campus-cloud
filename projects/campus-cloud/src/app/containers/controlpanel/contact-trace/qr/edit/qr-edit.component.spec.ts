import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';

import { ServicesModule } from '@controlpanel/manage/services/services.module';
import { CPTestModule } from '@campus-cloud/shared/tests';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import { QrEditComponent } from './qr-edit.component';

class MockService {
  dummy;

  updateProvider(body: any, providerId: number, search: any) {
    this.dummy = [body, providerId, search];

    return observableOf({});
  }
}

const mockProvider = {
  has_checkout: false,
  provider_name: 'Hello World!',
  checkin_verification_methods: [1, 2, 3],
};

describe('QrEditComponent', () => {
  let spy;
  let component: QrEditComponent;
  let fixture: ComponentFixture<QrEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, ServicesModule, RouterTestingModule],
      providers: [ServicesUtilsService, { provide: ProvidersService, useClass: MockService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QrEditComponent);

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
