import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { get as _get } from 'lodash';
import { Store } from '@ngrx/store';

import { TEAM_ACCESS } from '../utils';
import { CPSession } from '../../../../../session';
import { baseActions, IHeader } from '../../../../../store/base';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { MODAL_TYPE } from '../../../../../shared/components/cp-modal';
import { AdminService, ErrorService, CPI18nService } from '../../../../../shared/services';

import {
  accountsToStoreMap,
  canAccountLevelReadResource
} from './../../../../../shared/utils/privileges/privileges';

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
  selector: 'cp-team-edit',
  templateUrl: './team-edit.component.html',
  styleUrls: ['./team-edit.component.scss']
})
export class TeamEditComponent extends BaseComponent implements OnInit {
  user;
  adminId;
  loading;
  formData;
  schoolId;
  formError;
  clubsMenu;
  buttonData;
  eventsMenu;
  privileges;
  editingUser;
  isFormError;
  audienceMenu;
  manageAdmins;
  servicesMenu;
  isClubsModal;
  isProfileView;
  isCurrentUser;
  canReadEvents;
  athleticsMenu;
  isServiceModal;
  canReadAudience;
  canReadServices;
  form: FormGroup;
  isAthleticsModal;
  schoolPrivileges;
  clubsCount = null;
  accountPrivileges;
  isAllAccessEnabled;
  currentUserCanManage;
  servicesCount = null;
  athleticsCount = null;
  MODAL_TYPE = MODAL_TYPE.WIDE;
  CP_PRIVILEGES_MAP = CP_PRIVILEGES_MAP;

  resetClubsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetServiceModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  resetAthleticsModal$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private route: ActivatedRoute,
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    public utils: TeamUtilsService,
    private adminService: AdminService,
    private errorService: ErrorService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.adminId = this.route.snapshot.params['adminId'];
    this.isProfileView = this.route.snapshot.queryParams['profile'];

    this.fetch();
  }

  updateServicesDropdownLabel() {
    const numberOfServices = this.utils.getNumberOf(
      CP_PRIVILEGES_MAP.services,
      this.accountPrivileges
    );

    this.servicesCount = numberOfServices ? { label: `${numberOfServices} Service(s)` } : null;
  }

  updateClubsDropdownLabel() {
    const numberOfClubs = this.utils.getNumberOf(CP_PRIVILEGES_MAP.clubs, this.accountPrivileges);

    this.clubsCount = numberOfClubs ? { label: `${numberOfClubs} Club(s)` } : null;
  }

  updateAthleticsDropdownLabel() {
    const numberOfAthletics = this.utils.getNumberOf(
      CP_PRIVILEGES_MAP.athletics,
      this.accountPrivileges
    );

    this.athleticsCount = numberOfAthletics ? { label: `${numberOfAthletics} Athletic(s)` } : null;
  }

  fetch() {
    const isEqual = require('lodash').isEqual;
    const admin$ = this.adminService.getAdminById(this.adminId);

    super.fetchData(admin$).then((user) => {
      this.editingUser = user.data;

      this.isCurrentUser = this.editingUser.id === this.session.g.get('user').id;

      this.buildHeader(`${this.editingUser.firstname} ${this.editingUser.lastname}`);

      this.buildForm(this.editingUser);

      this.schoolPrivileges = Object.assign(
        {},
        this.editingUser.school_level_privileges[this.schoolId]
      );

      this.accountPrivileges = Object.assign({}, this.editingUser.account_level_privileges);
      if (!this.schoolPrivileges[CP_PRIVILEGES_MAP.services]) {
        this.updateServicesDropdownLabel();
      }

      if (!this.schoolPrivileges[CP_PRIVILEGES_MAP.clubs]) {
        this.updateClubsDropdownLabel();
      }

      if (!this.schoolPrivileges[CP_PRIVILEGES_MAP.athletics]) {
        this.updateAthleticsDropdownLabel();
      }

      this.isAllAccessEnabled =
        isEqual(this.schoolPrivileges, this.user.school_level_privileges[this.schoolId]) &&
        isEqual(this.accountPrivileges, this.user.account_level_privileges);
    });
  }

  audienceDefaultPermission() {
    const allAccess = _get(this.schoolPrivileges, CP_PRIVILEGES_MAP.audience, false);

    return allAccess
      ? this.audienceMenu.filter((item) => item.action === audienceMenuStatus.allAccess)[0]
      : this.audienceMenu.filter((item) => item.action === audienceMenuStatus.noAccess)[0];
  }

  servicesDefaultPermission() {
    if (this.servicesCount) {
      return this.servicesCount;
    }
    let selected;
    const school_level_privileges = this.schoolPrivileges;
    const service_privilege = school_level_privileges[CP_PRIVILEGES_MAP.services];

    if (!service_privilege) {
      selected = this.servicesMenu[0];
      Object.keys(this.accountPrivileges).forEach((store) => {
        if (this.accountPrivileges[store][CP_PRIVILEGES_MAP.services]) {
          selected = this.servicesMenu[1];
        }
      });
    } else if (service_privilege.r && service_privilege.w) {
      selected = this.servicesMenu[2];
    } else {
      selected = this.servicesMenu[1];
    }

    return selected;
  }

  clubsDefaultPermission() {
    if (this.clubsCount) {
      return this.clubsCount;
    }

    let selected;
    const school_level_privileges = this.schoolPrivileges;
    const club_privilege = school_level_privileges[CP_PRIVILEGES_MAP.clubs];

    if (!club_privilege) {
      selected = this.clubsMenu[0];
      Object.keys(this.accountPrivileges).forEach((store) => {
        if (this.accountPrivileges[store][CP_PRIVILEGES_MAP.clubs]) {
          selected = this.clubsMenu[1];
        }
      });
    } else if (club_privilege.r && club_privilege.w) {
      selected = this.clubsMenu[2];
    } else {
      selected = this.clubsMenu[1];
    }

    return selected;
  }

  athleticsDefaultPermission() {
    if (this.athleticsCount) {
      return this.athleticsCount;
    }

    let selected;
    const school_level_privileges = this.schoolPrivileges;
    const athletics_privilege = school_level_privileges[CP_PRIVILEGES_MAP.athletics];

    if (!athletics_privilege) {
      selected = this.athleticsMenu[0];
      Object.keys(this.accountPrivileges).forEach((store) => {
        if (this.accountPrivileges[store][CP_PRIVILEGES_MAP.athletics]) {
          selected = this.athleticsMenu[1];
        }
      });
    } else if (athletics_privilege.r && athletics_privilege.w) {
      selected = this.athleticsMenu[2];
    } else {
      selected = this.athleticsMenu[1];
    }

    return selected;
  }

  eventsDefaultPermission() {
    const school_level_privileges = this.schoolPrivileges;

    const eventPrivilege = school_level_privileges[CP_PRIVILEGES_MAP.events] || {
      r: false,
      w: false
    };

    const eventAssessmentPrivilege = school_level_privileges[
      CP_PRIVILEGES_MAP.event_attendance
    ] || { r: false, w: false };

    if (eventPrivilege.w && eventAssessmentPrivilege.w) {
      return this.eventsMenu.filter((item) => item.action === 3)[0];
    } else if (eventPrivilege.w) {
      return this.eventsMenu.filter((item) => item.action === 2)[0];
    }

    return this.eventsMenu.filter((item) => item.action === null)[0];
  }

  private buildHeader(name) {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `[NOTRANSLATE]${name}[NOTRANSLATE]`,
        crumbs: {
          url: this.isProfileView ? null : '/settings/team',
          label: this.isProfileView ? null : 'team_settings'
        },
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  private buildForm(profile) {
    this.form = this.fb.group({
      firstname: [profile.firstname, Validators.required],
      lastname: [profile.lastname, Validators.required],
      email: [profile.email, Validators.required]
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
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

    let _data: any = {
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

    if (this.isCurrentUser) {
      /**
       * @data (firstname, lastname, email)
       * this fields are only needed when updating the
       * current user, if sent when updating another user the BE fails
       */
      const { firstname, lastname } = data;

      _data = { firstname, lastname };
    }

    this.adminService.updateAdmin(this.adminId, _data).subscribe(
      () => {
        this.router.navigate([this.currentUserCanManage ? '/settings/team' : '/dashboard']);
      },
      (err) => {
        if (err.status === 403) {
          $('#teamUnauthorziedModal').modal();

          return;
        }

        this.isFormError = true;

        if (err.status === 409) {
          this.formError = this.cpI18n.translate('duplicate_entry');

          return;
        }

        this.formError = this.cpI18n.translate('all_fields_are_required');
      }
    );
  }

  onManageAdminSelected(data) {
    if (data.action === manageAdminMenu.disabled) {
      if (CP_PRIVILEGES_MAP.manage_admin in this.schoolPrivileges) {
        delete this.schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
      }

      Object.keys(this.accountPrivileges).forEach((storeId) => {
        if (!Object.keys(this.accountPrivileges[storeId]).length) {
          delete this.accountPrivileges[storeId];
        }
      });

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
    this.doServicesCleanUp();

    const servicesLength = Object.keys(services).length;
    this.servicesCount = servicesLength
      ? { label: `${servicesLength} ${this.cpI18n.translate('admin_form_label_services')}` }
      : null;

    this.accountPrivileges = Object.assign({}, this.accountPrivileges, ...services);
  }

  onServicesSelected(service) {
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

    this.doServicesCleanUp();
    this.resetServiceModal$.next(true);

    if (service.action === serviceMenu.noAccess) {
      if (this.schoolPrivileges) {
        if (CP_PRIVILEGES_MAP.services in this.schoolPrivileges) {
          delete this.schoolPrivileges[CP_PRIVILEGES_MAP.services];
        }
      }

      return;
    }

    this.schoolPrivileges = Object.assign({}, this.schoolPrivileges, {
      [CP_PRIVILEGES_MAP.services]: {
        r: service.action === 2 ? true : true,
        w: service.action === 2 ? false : true
      }
    });
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

  onClubsModalSelected(clubs) {
    this.doClubsCleanUp();
    const clubsLength = Object.keys(clubs).length;
    this.clubsCount = clubsLength
      ? { label: `${clubsLength} ${this.cpI18n.translate('admin_form_label_clubs')}` }
      : null;

    this.accountPrivileges = Object.assign({}, this.accountPrivileges, ...clubs);
  }

  onAthleticsModalSelected(athletics) {
    this.doAthleticsCleanUp();

    const athleticsLength = Object.keys(athletics).length;
    this.athleticsCount = athleticsLength
      ? { label: `${athleticsLength} ${this.cpI18n.translate('admin_form_label_athletics')}` }
      : null;

    this.accountPrivileges = Object.assign({}, this.accountPrivileges, ...athletics);
  }

  onClubsSelected(club) {
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
      this.doClubsCleanUp();
      this.resetClubsModal$.next(true);

      return;
    }

    if (club.action === clubMenu.allClubs) {
      this.doClubsCleanUp();
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
      this.doAthleticsCleanUp();
      this.resetAthleticsModal$.next(true);

      return;
    }

    if (athletic.action === athleticMenu.allAthletics) {
      this.doAthleticsCleanUp();
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

  disableDependencies(deps: Array<number>) {
    deps.forEach((dep) => {
      if (this.schoolPrivileges && this.schoolPrivileges[dep]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }

  handleDependencies(privilegeNo, dependencies: Array<number>) {
    if (!dependencies.length) {
      return;
    }

    dependencies.forEach((dep) => {
      if (this.schoolPrivileges[dep]) {
        return;
      }

      if (this.schoolPrivileges[privilegeNo]) {
        this.checkControl(undefined, dep, { deps: [] });
      }
    });
  }

  checkControl(isChecked, privilegeNo, privilegeExtraData): void {
    if (!isChecked) {
      Object.keys(this.accountPrivileges).forEach((storeId) => {
        if (!Object.keys(this.accountPrivileges[storeId]).length) {
          delete this.accountPrivileges[storeId];
        }
      });
    }

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
    this.user = this.session.g.get('user');
    this.schoolId = this.session.g.get('school').id;

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('update')
    };

    const schoolPrivileges = this.user.school_level_privileges[this.schoolId] || {};

    this.currentUserCanManage =
      CP_PRIVILEGES_MAP.manage_admin in schoolPrivileges
        ? schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin].w
        : false;

    this.canReadEvents = schoolPrivileges[CP_PRIVILEGES_MAP.events] || false;

    this.canReadAudience = schoolPrivileges[CP_PRIVILEGES_MAP.audience] || false;

    this.canReadServices = schoolPrivileges[CP_PRIVILEGES_MAP.services] || false;
    this.formData = TEAM_ACCESS.getMenu(this.user.school_level_privileges[this.schoolId]);

    const clubsPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.clubs];

    const clubsPrivilegeAccount = canAccountLevelReadResource(session, CP_PRIVILEGES_MAP.clubs);

    const athleticsPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.athletics];

    const athleticsPrivilegeAccount = canAccountLevelReadResource(
      session,
      CP_PRIVILEGES_MAP.athletics
    );

    const eventsPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.events];

    const servicesPrivilegeSchool = schoolPrivileges[CP_PRIVILEGES_MAP.services];

    const servicesPrivilegeAccount = canAccountLevelReadResource(
      session,
      CP_PRIVILEGES_MAP.services
    );

    const manageAdminPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.manage_admin];
    const eventsAssessmentPrivilege = schoolPrivileges[CP_PRIVILEGES_MAP.event_attendance];

    this.audienceMenu = this.utils.audienceDropdown(schoolPrivileges[CP_PRIVILEGES_MAP.audience]);

    this.manageAdmins = this.utils.manageAdminDropdown(manageAdminPrivilege);
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
  }
}
