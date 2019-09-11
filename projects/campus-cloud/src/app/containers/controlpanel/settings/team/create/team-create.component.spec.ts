import { HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { provideMockStore } from '@ngrx/store/testing';
import { TeamCreateComponent } from './team-create.component';
import { accountsToStoreMap } from '@campus-cloud/shared/utils';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { filledForm, mockTeam } from '@controlpanel/settings/team/tests';
import { AdminService, ErrorService } from '@campus-cloud/shared/services';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import {
  clubMenu,
  eventMenu,
  serviceMenu,
  athleticMenu,
  manageAdminMenu,
  TeamUtilsService,
  audienceMenuStatus
} from '../team.utils.service';

const privilegeSet = { r: true, w: true };

describe('TeamCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule, HttpClientModule, RouterTestingModule],
        providers: [provideMockStore(), TeamUtilsService, AdminService, ErrorService],
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
  });

  describe('Select Audience Privileges', () => {
    it('should remove audience privileges if no access selected', () => {
      const audience = {
        action: audienceMenuStatus.noAccess
      };

      component.onAudienceSelected(audience);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.audience]).toBeUndefined();
    });

    it('should add audience privileges if all access selected', () => {
      const audience = {
        action: audienceMenuStatus.allAccess
      };

      component.onAudienceSelected(audience);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.audience]).toEqual(privilegeSet);
    });
  });

  describe('Select Regular/Emergency Announcement Privileges', () => {
    it('should disable form submit if regular or emergency announcement with no store privilege', () => {
      component.schoolPrivileges = {
        ...component.schoolPrivileges,
        [CP_PRIVILEGES_MAP.campus_announcements]: privilegeSet,
        [CP_PRIVILEGES_MAP.emergency_announcement]: privilegeSet
      };
      component.ngOnInit();
      component.hasStorePrivileges();

      expect(component.buttonData.disabled).toBe(true);
      expect(component.hasStorePrivileges()).toBe(false);
    });

    it('should enable form submit if regular or emergency announcement with any of the store privilege', () => {
      component.schoolPrivileges = {
        ...component.schoolPrivileges,
        [CP_PRIVILEGES_MAP.campus_announcements]: privilegeSet,
        [CP_PRIVILEGES_MAP.emergency_announcement]: privilegeSet,
        [CP_PRIVILEGES_MAP.clubs]: privilegeSet // added club store privilege
      };

      component.ngOnInit();

      component.form.setValue(filledForm);

      component.hasStorePrivileges();

      expect(component.buttonData.disabled).toBe(false);
      expect(component.hasStorePrivileges()).toBe(true);
    });
  });

  describe('Select Admin Privileges', () => {
    it('should not have admin privileges if it set to disable', () => {
      const admin = {
        action: manageAdminMenu.disabled
      };

      component.onManageAdminSelected(admin);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin]).toBeUndefined();
    });

    it('should have admin privileges if it set to enable', () => {
      const admin = {
        action: manageAdminMenu.enabled
      };

      component.onManageAdminSelected(admin);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin]).toEqual(privilegeSet);
    });
  });

  describe('Toggle All Admin Access', () => {
    it('should not have all access to admin if set to false', () => {
      component.toggleAllAccess(false);

      expect(component.schoolPrivileges).toEqual({});
      expect(component.accountPrivileges).toEqual({});
    });

    it('should have all access to admin if set to true', () => {
      component.ngOnInit();
      component.toggleAllAccess(true);

      const accountLevelPrivileges = accountsToStoreMap(
        user.account_mapping[school.id],
        user.account_level_privileges
      );

      expect(component.accountPrivileges).toEqual(accountLevelPrivileges);
      expect(component.schoolPrivileges).toEqual(user.school_level_privileges[school.id]);
    });
  });

  describe('Select Events Privileges', () => {
    it('should not have events privileges if no access selected', () => {
      const event = {
        action: eventMenu.noAccess
      };

      component.onEventsSelected(event);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.events]).toBeUndefined();
      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance]).toBeUndefined();
    });

    it('should have only events privileges if manage events selected', () => {
      const event = {
        action: eventMenu.manageEvents
      };

      component.onEventsSelected(event);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.events]).toEqual(privilegeSet);
    });

    it('should have both events & assessment privileges if manage events & assessment selected', () => {
      const event = {
        action: eventMenu.manageEventsAndAssess
      };

      component.onEventsSelected(event);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.events]).toEqual(privilegeSet);
      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance]).toEqual(privilegeSet);
    });
  });

  describe('Select Services Privileges', () => {
    it('should open service modal if select service selected', () => {
      const service = {
        action: serviceMenu.selectServices
      };

      component.onServicesSelected(service);

      expect(component.isServiceModal).toBe(true);
    });

    it('should not have services privileges if no access selected', () => {
      const service = {
        action: serviceMenu.noAccess
      };

      component.onServicesSelected(service);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.services]).toBeUndefined();
    });

    it('should have services privileges if all services selected', () => {
      const service = {
        action: serviceMenu.allServices
      };

      component.onServicesSelected(service);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.services]).toEqual(privilegeSet);
    });
  });

  describe('Select Clubs Privileges', () => {
    it('should open clubs modal if select club selected', () => {
      const club = {
        action: clubMenu.selectClubs
      };

      component.onClubsSelected(club);

      expect(component.isClubsModal).toBe(true);
    });

    it('should not have clubs privileges if no access selected', () => {
      const club = {
        action: clubMenu.noAccess
      };

      component.onClubsSelected(club);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.clubs]).toBeUndefined();
    });

    it('should have clubs privileges if all clubs selected', () => {
      const club = {
        action: clubMenu.allClubs
      };

      component.onClubsSelected(club);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.clubs]).toEqual(privilegeSet);
    });
  });

  describe('Select Athletics Privileges', () => {
    it('should open athletics modal if select athletic selected', () => {
      const athletic = {
        action: athleticMenu.selectAthletic
      };

      component.onAthleticsSelected(athletic);

      expect(component.isAthleticsModal).toBe(true);
    });

    it('should not have athletics privileges if no access selected', () => {
      const athletic = {
        action: athleticMenu.noAccess
      };

      component.onAthleticsSelected(athletic);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.athletics]).toBeUndefined();
    });

    it('should have athletics privileges if all athletics selected', () => {
      const athletic = {
        action: athleticMenu.allAthletics
      };

      component.onAthleticsSelected(athletic);

      expect(component.schoolPrivileges[CP_PRIVILEGES_MAP.athletics]).toEqual(privilegeSet);
    });
  });

  describe('Store Labels', () => {
    it('should update services label dropdown', () => {
      component.schoolPrivileges = {
        [CP_PRIVILEGES_MAP.services]: privilegeSet
      };

      component.updateServicesDropdownLabel();

      expect(component.servicesCount.label).toEqual(
        component.cpI18n.translate('admin_all_services')
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {
        [578]: { [CP_PRIVILEGES_MAP.services]: privilegeSet }
      };

      component.updateServicesDropdownLabel();

      expect(component.servicesCount.label).toEqual(
        `${1} ${component.cpI18n.translate('admin_form_label_services')}`
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      component.updateServicesDropdownLabel();

      expect(component.servicesCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
    });

    it('should update clubs label dropdown', () => {
      component.schoolPrivileges = {
        [CP_PRIVILEGES_MAP.clubs]: privilegeSet
      };

      component.updateClubsDropdownLabel();

      expect(component.clubsCount.label).toEqual(component.cpI18n.translate('admin_all_clubs'));

      component.schoolPrivileges = {};
      component.accountPrivileges = {
        [578]: { [CP_PRIVILEGES_MAP.clubs]: privilegeSet }
      };

      component.updateClubsDropdownLabel();

      expect(component.clubsCount.label).toEqual(
        `${1} ${component.cpI18n.translate('admin_form_label_clubs')}`
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      component.updateClubsDropdownLabel();

      expect(component.clubsCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
    });

    it('should update athletics label dropdown', () => {
      component.schoolPrivileges = {
        [CP_PRIVILEGES_MAP.athletics]: privilegeSet
      };

      component.updateAthleticsDropdownLabel();

      expect(component.athleticsCount.label).toEqual(
        component.cpI18n.translate('admin_all_athletics')
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {
        [578]: { [CP_PRIVILEGES_MAP.athletics]: privilegeSet }
      };

      component.updateAthleticsDropdownLabel();

      expect(component.athleticsCount.label).toEqual(
        `${1} ${component.cpI18n.translate('admin_form_label_athletics')}`
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      component.updateAthleticsDropdownLabel();

      expect(component.athleticsCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
    });

    describe('Create Admin', () => {
      it('should not create admin if form is not valid', () => {
        component.ngOnInit();

        const data = component.form.value;

        component.onSubmit(data);

        expect(component.form.valid).toBe(false);
      });

      it('should not create admin if no access granted (no school/account level privileges)', () => {
        component.ngOnInit();
        component.form.setValue(filledForm);

        const data = component.form.value;

        component.onSubmit(data);

        const errorMessage = component.cpI18n.translate('admins_error_no_access_granted');

        expect(component.isFormError).toBe(true);
        expect(component.formError).toEqual(errorMessage);
      });

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
        expect(component.isFormError).toBe(true);
        expect(component.formError).toEqual(errorMessage);
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
        expect(component.isFormError).toBe(true);
        expect(component.formError).toEqual(errorMessage);
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
});
