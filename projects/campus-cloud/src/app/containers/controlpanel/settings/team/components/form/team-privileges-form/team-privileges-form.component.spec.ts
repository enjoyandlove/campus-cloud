import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { CPSession } from '@campus-cloud/session';
import { TeamUtilsService } from '../../../team.utils.service';
import { filledForm } from '@controlpanel/settings/team/tests';
import { accountsToStoreMap } from '@campus-cloud/shared/utils';
import { mockSchool, mockUser } from '@campus-cloud/session/mock';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { TeamModel } from '@controlpanel/settings/team/model/team.model';
import { configureTestSuite, CPTestModule } from '@campus-cloud/shared/tests';
import { TeamPrivilegesFormComponent } from './team-privileges-form.component';
import {
  clubMenu,
  eventMenu,
  serviceMenu,
  athleticMenu,
  manageAdminMenu,
  audienceMenuStatus
} from '@controlpanel/settings/team/team.utils.service';

const privilegeSet = { r: true, w: true };

describe('TeamPrivilegesFormComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [CPTestModule],
        providers: [TeamUtilsService],
        declarations: [TeamPrivilegesFormComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let user;
  let school;
  let de: DebugElement;
  let session: CPSession;
  let component: TeamPrivilegesFormComponent;
  let fixture: ComponentFixture<TeamPrivilegesFormComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPrivilegesFormComponent);
    component = fixture.componentInstance;

    de = fixture.debugElement;
    session = TestBed.get(CPSession);
    session.g.set('user', mockUser);
    session.g.set('school', mockSchool);

    user = session.g.get('user');
    school = session.g.get('school');

    component.user = user;
    component.schoolId = school.id;
    component.form = TeamModel.form(filledForm);
    component.accountPrivileges = accountsToStoreMap(
      user.account_mapping[school.id],
      user.account_level_privileges
    );
    component.schoolPrivileges = user.school_level_privileges[school.id];
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
    it('should enable form submit if regular or emergency announcement with any of the store privilege', () => {
      component.ngOnInit();

      component.hasStorePrivileges();
      const submitButton = de.query(By.css('button[type="submit"]')).nativeElement;

      expect(submitButton.disabled).toBe(false);
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

      component.updateServiceDropdownLabel();

      expect(component.servicesCount.label).toEqual(
        component.cpI18n.translate('admin_all_services')
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {
        [578]: { [CP_PRIVILEGES_MAP.services]: privilegeSet }
      };

      component.updateServiceDropdownLabel();

      expect(component.servicesCount.label).toEqual(
        `${1} ${component.cpI18n.translate('admin_form_label_services')}`
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      component.updateServiceDropdownLabel();

      expect(component.servicesCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
    });

    it('should update clubs label dropdown', () => {
      component.schoolPrivileges = {
        [CP_PRIVILEGES_MAP.clubs]: privilegeSet
      };

      component.updateClubDropdownLabel();

      expect(component.clubsCount.label).toEqual(component.cpI18n.translate('admin_all_clubs'));

      component.schoolPrivileges = {};
      component.accountPrivileges = {
        [578]: { [CP_PRIVILEGES_MAP.clubs]: privilegeSet }
      };

      component.updateClubDropdownLabel();

      expect(component.clubsCount.label).toEqual(
        `${1} ${component.cpI18n.translate('admin_form_label_clubs')}`
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      component.updateClubDropdownLabel();

      expect(component.clubsCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
    });

    it('should update athletics label dropdown', () => {
      component.schoolPrivileges = {
        [CP_PRIVILEGES_MAP.athletics]: privilegeSet
      };

      component.updateAthleticDropdownLabel();

      expect(component.athleticsCount.label).toEqual(
        component.cpI18n.translate('admin_all_athletics')
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {
        [578]: { [CP_PRIVILEGES_MAP.athletics]: privilegeSet }
      };

      component.updateAthleticDropdownLabel();

      expect(component.athleticsCount.label).toEqual(
        `${1} ${component.cpI18n.translate('admin_form_label_athletics')}`
      );

      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      component.updateAthleticDropdownLabel();

      expect(component.athleticsCount.label).toEqual(component.cpI18n.translate('admin_no_access'));
    });
  });

  describe('Submit Form', () => {
    it('should throw error if missing required fields', () => {
      const errorMessage = component.cpI18n.translate('all_fields_are_required');

      component.ngOnInit();
      component.form.get('email').setValue(null);

      component.onSubmit();

      expect(component.isFormError).toBe(true);
      expect(component.formError).toEqual(errorMessage);
    });

    it('should throw error if no access granted', () => {
      component.schoolPrivileges = {};
      component.accountPrivileges = {};
      const errorMessage = component.cpI18n.translate('admins_error_no_access_granted');

      component.onSubmit();

      expect(component.isFormError).toBe(true);
      expect(component.formError).toEqual(errorMessage);
    });

    it('should submit form', () => {
      spyOn(component.formSubmitted, 'emit');

      component.ngOnInit();

      component.onSubmit();

      expect(component.formError).toBeNull();
      expect(component.isFormError).toBe(false);
      expect(component.formSubmitted.emit).toHaveBeenCalled();
    });
  });
});
