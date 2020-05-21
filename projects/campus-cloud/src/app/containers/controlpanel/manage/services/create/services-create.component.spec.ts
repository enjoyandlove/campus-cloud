import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { fillForm } from '@campus-cloud/shared/utils/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { filledForm } from '@controlpanel/manage/services/tests';
import { ServicesCreateComponent } from './services-create.component';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { ServicesService } from '@controlpanel/manage/services/services.service';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

describe('ServicesCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) => {
    (async () => {
      TestBed.configureTestingModule({
        declarations: [ServicesCreateComponent],
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
  let fixture: ComponentFixture<ServicesCreateComponent>;
  let component: ServicesCreateComponent;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ServicesCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.inject(CPSession);
    session.g.set('school', mockSchool);

    spyOn(component, 'trackEvent');
    spyOn(component, 'handleError');
    spyOn(component.router, 'navigate');
    spy = spyOn(component.servicesService, 'createService').and.returnValue(of([]));

    fixture.detectChanges();
  }));

  it('form validation should fail required fields missing', () => {
    const errorMessage = component.cpI18n.translate('error_fill_out_marked_fields');

    component.onSubmit();

    expect(component.formError).toBe(true);
    expect(component.form.valid).toBe(false);
    expect(component.handleError).toHaveBeenCalled();
    expect(component.buttonData.disabled).toBe(false);
    expect(component.handleError).toHaveBeenCalledWith(errorMessage);
  });

  it('should create service', () => {
    fillForm(component.form, filledForm);

    component.onSubmit();

    expect(spy).toHaveBeenCalled();
    expect(component.formError).toBe(false);
    expect(component.form.valid).toBe(true);
    expect(component.trackEvent).toHaveBeenCalled();
    expect(component.buttonData.disabled).toBe(false);
    expect(component.router.navigate).toHaveBeenCalled();
  });

  describe('form', () => {
    it('should have has_membership', () => {
      expect(component.form.get('has_membership')).toBeTruthy();
    });
  });
});
