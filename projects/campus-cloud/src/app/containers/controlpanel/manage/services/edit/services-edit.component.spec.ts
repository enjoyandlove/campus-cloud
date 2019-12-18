import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { ServicesEditComponent } from './services-edit.component';
import { mockService } from '@controlpanel/manage/services/tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ServicesService } from '@controlpanel/manage/services/services.service';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

describe('ServicesEditComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ServicesEditComponent],
        providers: [ServicesService, provideMockStore(), ServicesUtilsService],
        imports: [CPTestModule],
        schemas: [NO_ERRORS_SCHEMA]
      });
      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail);
  });

  let spy;
  let session;
  let fixture: ComponentFixture<ServicesEditComponent>;
  let component: ServicesEditComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesEditComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('school', mockSchool);

    spyOn(component, 'trackEvent');
    spyOn(component, 'handleError');
    spyOn(component.router, 'navigate');
    spyOn(component.servicesService, 'getServiceById').and.returnValue(of(mockService));

    fixture.detectChanges();
  }));

  it('form validation should fail required fields missing', () => {
    const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');
    component.form.get('name').setValue(null);

    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.handleError).toHaveBeenCalled();
    expect(component.buttonData.disabled).toBe(false);
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('should update service', () => {
    spy = spyOn(component.servicesService, 'updateService').and.returnValue(of({}));

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.formError).toBe(false);
    expect(component.form.valid).toBe(true);
    expect(component.trackEvent).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalled();
  });
});
