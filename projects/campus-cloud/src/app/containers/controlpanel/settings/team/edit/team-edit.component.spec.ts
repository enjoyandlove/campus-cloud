import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { TeamUtilsService } from '../team.utils.service';
import { TeamEditComponent } from './team-edit.component';
import { mockTeam } from '@controlpanel/settings/team/tests';
import { AdminService } from '@campus-cloud/shared/services';
import { accountsToStoreMap } from '@campus-cloud/shared/utils';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';

describe('TeamEditComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [provideMockStore(), TeamUtilsService, AdminService],
        declarations: [TeamEditComponent],
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
  let component: TeamEditComponent;
  let fixture: ComponentFixture<TeamEditComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamEditComponent);
    component = fixture.componentInstance;

    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    user = session.g.get('user');
    school = session.g.get('school');

    component.user = user;
    component.schoolId = school.id;
    component.accountPrivileges = accountsToStoreMap(
      user.account_mapping[school.id],
      user.account_level_privileges
    );

    spyOn(component, 'handleError');
    component.schoolPrivileges = user.school_level_privileges[school.id];
    spy = spyOn(component.adminService, 'getAdminById').and.returnValue(of(mockUser));
  });

  describe('Toggle All Admin Access', () => {
    it('should not have all access to admin if set to false', () => {
      component.onToggleAllAccess(false);

      expect(component.schoolPrivileges).toEqual({});
      expect(component.accountPrivileges).toEqual({});
      expect(component.isAllAccessEnabled).toBe(false);
    });

    it('should have all access to admin if set to true', () => {
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

  describe('Update Admin', () => {
    it('should throw duplicate entry error if record already exist', fakeAsync(() => {
      const error = new HttpErrorResponse({ error: 'error', status: 409 });
      const errorMessage = component.cpI18n.translate('duplicate_entry');
      spy = spyOn(component.adminService, 'updateAdmin').and.returnValues(throwError(error));

      component.ngOnInit();

      tick();

      const data = component.form.value;

      component.onSubmit(data);

      expect(spy).toHaveBeenCalled();
      expect(component.handleError).toHaveBeenCalled();
      expect(component.handleError).toHaveBeenCalledWith(errorMessage);
    }));

    it('should update admin', fakeAsync(() => {
      spyOn(component.router, 'navigate');
      spy = spyOn(component.adminService, 'updateAdmin').and.returnValues(of(mockTeam));

      component.ngOnInit();

      tick();

      const data = component.form.value;

      component.onSubmit(data);

      expect(spy).toHaveBeenCalled();
      expect(component.router.navigate).toHaveBeenCalled();
    }));
  });
});
