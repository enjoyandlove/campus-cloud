import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { configureTestSuite } from '@campus-cloud/shared/tests';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { TeamUtilsService } from '../team.utils.service';
import { TeamCreateComponent } from './team-create.component';
import { AdminService, CPI18nService, ErrorService } from '@campus-cloud/shared/services';

const privilegeSet = { r: true, w: true };

describe('TeamCreateComponent', () => {
  configureTestSuite();

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        imports: [SharedModule, HttpClientModule, RouterTestingModule, StoreModule.forRoot({})],
        providers: [CPSession, CPI18nService, TeamUtilsService, AdminService, ErrorService],
        declarations: [TeamCreateComponent],
        schemas: [NO_ERRORS_SCHEMA]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  let component: TeamCreateComponent;
  let fixture: ComponentFixture<TeamCreateComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamCreateComponent);
    component = fixture.componentInstance;
  });

  it('Should update services label dropdown', () => {
    component.schoolPrivileges = {
      [CP_PRIVILEGES_MAP.services]: privilegeSet
    };

    component.updateServicesDropdownLabel();

    expect(component.servicesCount.label).toEqual(component.cpI18n.translate('admin_all_services'));

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

  it('Should update clubs label dropdown', () => {
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

  it('Should update athletics label dropdown', () => {
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
});
