import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of as observableOf } from 'rxjs';

import { CPTestModule } from '@campus-cloud/shared/tests';
import { QrCreateComponent } from './qr-create.component';
import { QrModule } from '../qr.module';
import { ServicesUtilsService } from '@campus-cloud/containers/controlpanel/manage/services/services.utils.service';
import { ProvidersService } from '../../../manage/services/providers.service';

class MockService {
  dummy;

  createProvider(body: any, search: any) {
    this.dummy = [body, search];

    return observableOf({});
  }
}

const mockProvider = {
  has_checkout: false,
  provider_name: 'Hello World!'
};

describe('QrCreateComponent', () => {
  let spy;
  let component: QrCreateComponent;
  let fixture: ComponentFixture<QrCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CPTestModule, QrModule, RouterTestingModule],
      providers: [ServicesUtilsService, { provide: ProvidersService, useClass: MockService }]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(QrCreateComponent);

        fixture.detectChanges();
      });
  }));

  it('form validation should fail required fields missing', () => {
    expect(component.form.valid).toBe(false);
  });

  it('should add service provider', () => {
    spyOn(component, 'trackEvent');
    spyOn(component.created, 'emit');
    spy = spyOn(component.providersService, 'createProvider').and.returnValue(
      observableOf(mockProvider)
    );

    component.form.controls['has_checkout'].setValue(mockProvider.has_checkout);
    component.form.controls['provider_name'].setValue(mockProvider.provider_name);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalled();
    expect(component.created.emit).toHaveBeenCalledTimes(1);
    expect(component.created.emit).toHaveBeenCalledWith(mockProvider);
  });
});
