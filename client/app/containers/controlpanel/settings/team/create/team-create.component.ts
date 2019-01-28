import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '@app/session';
import { UserType } from '@shared/utils';
import { MODAL_TYPE } from '@shared/components';
import { baseActions, IHeader } from '@app/store/base';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@shared/constants';
import { ErrorService, AdminService, CPI18nService, CPTrackingService } from '@shared/services';

import {
  accountsToStoreMap,
  canSchoolReadResource,
  canAccountLevelReadResource
} from '@shared/utils/privileges';

import {
  clubMenu,
  eventMenu,
  serviceMenu,
  athleticMenu,
  manageAdminMenu,
  TeamUtilsService,
  audienceMenuStatus
} from '../team.utils.service';

declare var $: any;

@Component({
  selector: 'cp-team-create',
  templateUrl: './team-create.component.html',
  styleUrls: ['./team-create.component.scss']
})
export class TeamCreateComponent implements OnInit {
  user;
  formData;
  schoolId;
  formError;
  clubsMenu;
  eventsMenu;
  buttonData;
  isFormError;
  canReadClubs;
  manageAdmins;
  audienceMenu;
  servicesMenu;
  isClubsModal;
  canReadEvents;
  athleticsMenu;
  isServiceModal;
  canReadAudience;
  canReadServices;
  form: FormGroup;
  isAthleticsModal;
  canReadAthletics;
  accountPrivileges;
  isAllAccessEnabled;
  clubsCount = null;
  servicesCount = null;
  athleticsCount = null;
  schoolPrivileges = {};
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES_MAP = CP_PRIVILEGES_MAP;

  resetClubsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetServiceModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetAthleticsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public store: Store<IHeader>,
    public cpI18n: CPI18nService,
    public utils: TeamUtilsService,
    public teamService: AdminService,
    public errorService: ErrorService,
    public cpTracking: CPTrackingService
  ) {}

  private buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: require('../../settings.header.json')
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      firstname: [null, Validators.required],
      lastname: [null, Validators.required],
      email: [null, Validators.required]
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }

  onAudienceSelected(audience) {
    if (audience.action === audienceMenuStatus.noAccess) {
      if (CP_PRIVILEGES_MAP.audience in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.audience];
      }

      return;
    }

    if (audience.action === audienceMenuStatus.allAccess) {
      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.audience]: {
          r: true,
          w: true
        }
      });
    }
  }

  onSubmit(data) {
    this.formError = null;
    this.isFormError = false;

    if (!this.form.valid) {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.errorService.handleError({
        reason: this.cpI18n.translate('all_fields_are_required')
      });

      return;
    }

    const _data = {
      ...data,
      school_level_privileges: {
        [this.schoolId]: {
          ...this.schoolPrivileges
        }
      },
      account_level_privileges: {
        ...this.accountPrivileges
      }
    };

    const isEmpty = require('lodash').isEmpty;
    const emptyAccountPrivileges = isEmpty(_data.account_level_privileges);
    const emptySchoolPrivileges = isEmpty(_data.school_level_privileges[this.schoolId]);

    if (emptyAccountPrivileges && emptySchoolPrivileges) {
      this.formError = this.cpI18n.translate('admins_error_no_access_granted');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      this.isFormError = true;

      return;
    }

    this.teamService.createAdmin(_data).subscribe(
      () => {
        const source = UserType.isInternal(_data.email)
          ? amplitudeEvents.INTERNAL
          : amplitudeEvents.EXTERNAL;

        this.cpTracking.amplitudeEmitEvent(amplitudeEvents.INVITED_TEAM_MEMBER, { source });
        this.router.navigate(['/settings/team']);
      },
      (err) => {
        this.isFormError = true;

        if (err.status === 409) {
          this.formError = this.cpI18n.translate('duplicate_entry');

          return;
        }

        this.formError = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  onManageAdminSelected(data) {
    if (data.action === manageAdminMenu.disabled) {
      if (CP_PRIVILEGES_MAP.manage_admin in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
      }

      return;
    }

    if (data.action === manageAdminMenu.enabled) {
      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.manage_admin]: {
          r: true,
          w: true
        }
      });
    }
  }

  toggleAllAccess(checked) {
    if (checked) {
      this.accountPrivileges = Object.assign(
        {},
        accountsToStoreMap(
          this.session.g.get('user').account_mapping[this.schoolId],
          this.user.account_level_privileges
        )
      );

      this.schoolPrivileges = Object.assign({}, this.user.school_level_privileges[this.schoolId]);

      return;
    }

    this.schoolPrivileges = {};
    this.accountPrivileges = {};
  }

  onServicesModalSelected(services) {
    const servicesLength = Object.keys(services).length;
    this.servicesCount = servicesLength
      ? { label: `${servicesLength} ${this.cpI18n.translate('admin_form_label_services')}` }
      : null;

    this.accountPrivileges = Object.assign({}, this.accountPrivileges, ...services);
  }

  onServicesSelected(service) {
    this.doServicesCleanUp();
    if (service.action === serviceMenu.selectServices) {
      this.isServiceModal = true;

      setTimeout(
        () => {
          $('#selectServicesModal').modal();
        },

        1
      );

      return;
    }

    if (service.action === serviceMenu.noAccess) {
      this.resetServiceModal$.next(true);

      if (this.schoolPrivileges) {
        if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
          delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
        }
      }

      return;
    }

    if (service.action === serviceMenu.allServices) {
      this.resetServiceModal$.next(true);

      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.services]: {
          r: service.action === 2 ? true : true,
          w: service.action === 2 ? false : true
        }
      });
    }
  }

  onClubsModalSelected(clubs) {
    const clubsLength = Object.keys(clubs).length;
    this.clubsCount = clubsLength
      ? { label: `${clubsLength} ${this.cpI18n.translate('admin_form_label_clubs')}` }
      : null;

    this.accountPrivileges = Object.assign({}, this.accountPrivileges, ...clubs);
  }

  onAthleticsModalSelected(athletics) {
    const athleticsLength = Object.keys(athletics).length;
    this.athleticsCount = athleticsLength
      ? { label: `${athleticsLength} ${this.cpI18n.translate('admin_form_label_athletics')}` }
      : null;

    this.accountPrivileges = Object.assign({}, this.accountPrivileges, ...athletics);
  }

  doClubsCleanUp() {
    for (const storeId in this.accountPrivileges) {
      if (this.utils.isClub(this.accountPrivileges[storeId])) {
        delete this.accountPrivileges[storeId];
      }
    }

    if (CP_PRIVILEGES_MAP.clubs in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.clubs];
    }
  }

  doAthleticsCleanUp() {
    for (const storeId in this.accountPrivileges) {
      if (this.utils.isAthletic(this.accountPrivileges[storeId])) {
        delete this.accountPrivileges[storeId];
      }
    }

    if (CP_PRIVILEGES_MAP.athletics in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.athletics];
    }
  }

  doServicesCleanUp() {
    for (const storeId in this.accountPrivileges) {
      if (this.utils.isService(this.accountPrivileges[storeId])) {
        delete this.accountPrivileges[storeId];
      }
    }

    if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
      delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
    }
  }

  onClubsSelected(club) {
    this.doClubsCleanUp();
    if (club.action === clubMenu.selectClubs) {
      this.isClubsModal = true;
      setTimeout(
        () => {
          $('#selectClubsModal').modal();
        },

        1
      );

      return;
    }

    if (club.action === clubMenu.noAccess) {
      this.resetClubsModal$.next(true);

      return;
    }

    if (club.action === clubMenu.allClubs) {
      this.resetClubsModal$.next(true);

      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.clubs]: {
          r: true,
          w: true
        }
      });
    }
  }

  onAthleticsSelected(athletic) {
    this.doAthleticsCleanUp();
    if (athletic.action === athleticMenu.selectAthletic) {
      this.isAthleticsModal = true;
      setTimeout(
        () => {
          $('#selectAthleticsModal').modal();
        },

        1
      );

      return;
    }

    if (athletic.action === athleticMenu.noAccess) {
      this.resetAthleticsModal$.next(true);

      return;
    }

    if (athletic.action === athleticMenu.allAthletics) {
      this.resetAthleticsModal$.next(true);

      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.athletics]: {
          r: true,
          w: true
        }
      });
    }
  }

  onEventsSelected(event) {
    if (event.action === eventMenu.noAccess) {
      if (CP_PRIVILEGES_MAP.events in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.events];
      }
      if (CP_PRIVILEGES_MAP.event_attendance in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance];
      }

      return;
    }

    if (event.action === eventMenu.manageEvents) {
      if (CP_PRIVILEGES_MAP.event_attendance in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance];
      }

      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.events]: {
          r: true,
          w: true
        }
      });
    }

    if (event.action === eventMenu.manageEventsAndAssess) {
      this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
        [CP_PRIVILEGES_MAP.events]: {
          r: true,
          w: true
        },

        [CP_PRIVILEGES_MAP.event_attendance]: {
          r: true,
          w: true
        }
      });
    }
  }

  handleDependencies(privilegeNo, dependencies: Array<number>) {
    if (!dependencies.length) {
      return;
    }

    dependencies.map((dep) => {
      if (this.schoolPrivileges[dep]) {
        return;
      }

      if (this.schoolPrivileges[privilegeNo]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }

  disableDependencies(deps: Array<number>) {
    deps.map((dep) => {
      if (this.schoolPrivileges && this.schoolPrivileges[dep]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }

  checkControl(isChecked, privilegeNo, privilegeExtraData): void {
    if (!isChecked && privilegeExtraData.disables) {
      this.disableDependencies(privilegeExtraData.disables);
    }

    if (this.schoolPrivileges && this.schoolPrivileges[privilegeNo]) {
      delete this.schoolPrivileges[privilegeNo];
      this.handleDependencies(privilegeNo, privilegeExtraData.deps);

      return;
    }

    const privilege = this.user.school_level_privileges[this.schoolId][privilegeNo];

    this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
      [privilegeNo]: {
        r: privilege.r,
        w: privilege.w
      }
    });

    this.handleDependencies(privilegeNo, privilegeExtraData.deps);
  }

  ngOnInit() {
    const session = this.session.g;
    const { school_level_privileges } = session.get('user');
    const schoolPrivileges = school_level_privileges[session.get('school').id];
    this.user = session.get('user');
    this.schoolId = session.get('school').id;

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('admin_create_button')
    };

    this.canReadClubs =
      canSchoolReadResource(session, CP_PRIVILEGES_MAP.clubs) ||
      canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.clubs);

    this.canReadAudience = canSchoolReadResource(session, CP_PRIVILEGES_MAP.audience);

    this.canReadAthletics =
      canSchoolReadResource(session, CP_PRIVILEGES_MAP.athletics) ||
      canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.athletics);

    this.canReadEvents = canSchoolReadResource(session, CP_PRIVILEGES_MAP.events);

    this.canReadServices =
      canSchoolReadResource(session, CP_PRIVILEGES_MAP.services) ||
      canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.services);

    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    this.buildHeader();
    this.buildForm();

    const clubsPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.clubs];

    const clubsPrivilegeAccount = canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.clubs);

    const athleticsPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.athletics];

    const athleticsPrivilegeAccount = canAccountLevelReadResource(
      session,
      CP_PRIVILEGES_MAP.athletics
    );

    const eventsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.events];

    const eventsAssessmentPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance];

    const servicesPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.services];

    const servicesPrivilegeAccount = canAccountLevelReadResource(
      session,
      CP_PRIVILEGES_MAP.services
    );

    const manageAdminPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];

    this.clubsMenu = this.utils.clubsDropdown(clubsPrivilegeSchool, clubsPrivilegeAccount);
    this.athleticsMenu = this.utils.athleticsDropdown(
      athleticsPrivilegeSchool,
      athleticsPrivilegeAccount
    );
    this.eventsMenu = this.utils.eventsDropdown(eventsPrivilege, eventsAssessmentPrivilege);
    this.servicesMenu = this.utils.servicesDropdown(
      servicesPrivilegeSchool,
      servicesPrivilegeAccount
    );
    this.audienceMenu = this.utils.audienceDropdown(schoolPrivileges[CP_PRIVILEGES_MAP.audience]);
    this.manageAdmins = this.utils.manageAdminDropdown(manageAdminPrivilege);
  }
}

export const accountCleanUp = function(accountPrivileges, privilegeNo: number) {
  if (accountPrivileges) {
    Object.keys(accountPrivileges).map((store) => {
      if (privilegeNo in accountPrivileges[store]) {
        delete accountPrivileges[store][privilegeNo];

        if (!Object.keys(accountPrivileges[store]).length) {
          delete accountPrivileges[store];
        }
      }
    });
  }

  return accountPrivileges;
};
