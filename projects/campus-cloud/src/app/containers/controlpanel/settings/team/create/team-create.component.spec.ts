import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { provideMockStore } from '@ngrx/store/testing';
import { TeamUtilsService } from '../team.utils.service';
import { AdminService } from '@campus-cloud/shared/services';
import { TeamCreateComponent } from './team-create.component';
import { accountsToStoreMap } from '@campus-cloud/shared/utils';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { filledForm, mockTeam } from '@controlpanel/settings/team/tests';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('TeamCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [provideMockStore(), TeamUtilsService, AdminService],
        declarations: [TeamCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let spy;
  let user;
  let school;
  let session: CPSession;
  let component: TeamCreateComponent;
  let fixture: ComponentFixture<TeamCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCreateComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    user = session.g.get('user');
    school = session.g.get('school');

    spyOn(component, 'handleError');
  });

  describe('Toggle All Admin Access', () => {
    it('should not have all access to admin if set to false', () => {
      component.onToggleAllAccess(false);

      expect(component.schoolPrivileges).toEqual({});
      expect(component.accountPrivileges).toEqual({});
      expect(component.isAllAccessEnabled).toBe(false);
    });

    it('should have all access to admin if set to true', () => {
      component.ngOnInit();
      component.onToggleAllAccess(true);

      const accountLevelPrivileges = accountsToStoreMap(
        user.account_mapping[school.id],
        user.account_level_privileges
      );

      expect(component.isAllAccessEnabled).toBe(true);
      expect(component.accountPrivileges).toEqual(accountLevelPrivileges);
      expect(component.schoolPrivileges).toEqual(user.school_level_privileges[school.id]);
    });
  });

  describe('Create Admin', () => {
    it('should throw error if something went wrong', () => {
      component.schoolPrivileges = user.school_level_privileges;
      const error = new HttpErrorResponse({ error: 'error' });
      const errorMessage = component.cpI18n.translate('something_went_wrong');
      spy = spyOn(component.teamService, 'createAdmin').and.returnValues(throwError(error));

      component.ngOnInit();
      component.form.setValue(filledForm);

      const data = component.form.value;

      component.onSubmit(data);

      expect(spy).toHaveBeenCalled();
      expect(component.handleError).toHaveBeenCalled();
      expect(component.handleError).toHaveBeenCalledWith(errorMessage);
    });

    it('should throw duplicate entry error if record already exist', () => {
      component.schoolPrivileges = user.school_level_privileges;
      const error = new HttpErrorResponse({ error: 'error', status: 409 });
      const errorMessage = component.cpI18n.translate('duplicate_entry');
      spy = spyOn(component.teamService, 'createAdmin').and.returnValues(throwError(error));

      component.ngOnInit();
      component.form.setValue(filledForm);

      const data = component.form.value;

      component.onSubmit(data);

      expect(spy).toHaveBeenCalled();
      expect(component.handleError).toHaveBeenCalled();
      expect(component.handleError).toHaveBeenCalledWith(errorMessage);
    });

    it('should create admin', () => {
      spyOn(component.router, 'navigate');
      spyOn(component.cpTracking, 'amplitudeEmitEvent');
      component.schoolPrivileges = user.school_level_privileges;
      spy = spyOn(component.teamService, 'createAdmin').and.returnValues(of(mockTeam));

      component.ngOnInit();
      component.form.setValue(filledForm);

      const data = component.form.value;

      component.onSubmit(data);

      expect(spy).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalled();
      expect(component.cpTracking.amplitudeEmitEvent).toHaveBeenCalled();
    });
  });
});
