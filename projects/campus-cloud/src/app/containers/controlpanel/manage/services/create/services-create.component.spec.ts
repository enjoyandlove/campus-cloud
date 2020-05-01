import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { fillForm } from '@campus-cloud/shared/utils/tests';
import { mockSchool } from '@campus-cloud/session/mock/school';
import { filledForm } from '@controlpanel/manage/services/tests';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { ServicesCreateComponent } from './services-create.component';
import { mockUser } from '@projects/campus-cloud/src/app/session/mock';
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

    it('has_membership should be false if admin has not access to moderation', () => {
      const { account_level_privileges, school_level_privileges, ...rest } = mockUser;
      let user = {
        ...rest,
        account_level_privileges: {},
        school_level_privileges: {
          [component.session.school.id]: {}
        }
      };

      component.session.g.set('user', user);
      component.ngOnInit();

      expect(component.form.get('has_membership').value).toBe(false, 'with insuficcent privileges');

      user = {
        ...user,
        school_level_privileges: {
          [component.session.school.id]: {
            [CP_PRIVILEGES_MAP.moderation]: { w: true, r: true },
            [CP_PRIVILEGES_MAP.membership]: { w: true, r: true }
          }
        }
      };
      component.session.g.set('user', user);
      component.ngOnInit();

      expect(component.form.get('has_membership').value).toBe(true, 'with right privileges');
    });
  });
});
