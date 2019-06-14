/*tslint:disable:max-line-length*/
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import { baseActions, IHeader } from '@app/store';
import { canSchoolReadResource } from '@shared/utils';
import { parseErrorResponse } from '@shared/utils/http';
import { CustomValidators } from '@shared/validators';
import { AnnouncementsService } from '../announcements.service';
import { AudienceType } from '@controlpanel/audience/audience.status';
import { CP_PRIVILEGES_MAP, STATUS, amplitudeEvents } from '@shared/constants';
import { CPI18nService, StoreService, CPTrackingService } from '@shared/services';
import { AudienceUtilsService } from '@controlpanel/audience/audience.utils.service';

interface IState {
  isUrgent: boolean;
  isToLists: boolean;
  isToUsers: boolean;
  isToPersona: boolean;
  isToFilters: boolean;
  isEmergency: boolean;
  isCampusWide: boolean;
  validUserCount: boolean;
}

const state: IState = {
  isUrgent: false,
  isToLists: false,
  isToUsers: false,
  isToPersona: false,
  isToFilters: false,
  isEmergency: false,
  isCampusWide: true,
  validUserCount: false
};

const THROTTLED_STATUS = 1;

@Component({
  selector: 'cp-announcements-compose',
  templateUrl: './announcements-compose.component.html',
  styleUrls: ['./announcements-compose.component.scss']
})
export class AnnouncementsComposeComponent implements OnInit, OnDestroy {
  stores$;
  isError;
  sendAsName;
  buttonData;
  errorMessage;
  selectedType;
  form: FormGroup;
  canReadAudience;
  isAudienceImport = false;

  URGENT_TYPE = 1;
  REGULAR_TYPE = 2;
  EMERGENCY_TYPE = 0;

  USERS_TYPE = 1;
  LISTS_TYPE = 2;

  state: IState = state;
  shouldConfirm = false;

  subject_prefix = {
    label: null,
    type: null
  };

  amplitudeEventProperties = {
    host_type: null,
    sub_menu_name: null,
    audience_type: null,
    announcement_type: amplitudeEvents.REGULAR
  };

  types;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public storeService: StoreService,
    public service: AnnouncementsService,
    public cpTracking: CPTrackingService,
    private audienceUtils: AudienceUtilsService
  ) {
    const school = this.session.g.get('school');
    const search: HttpParams = new HttpParams().append('school_id', school.id.toString());

    this.stores$ = this.storeService.getStores(search);
  }

  onImportError() {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        body: this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  redirectToSaveTab({ id }) {
    this.store.dispatch({
      type: baseActions.AUDIENCE_IMPORTED,
      payload: {
        audience_id: id,
        new_audience_active: false,
        saved_audience_active: true
      }
    });
    this.trackImportAudience();
  }

  onNewAudienceTypeChange(audienceState) {
    this.state = { ...this.state, validUserCount: false };

    if (audienceState.custom) {
      this.state = {
        ...this.state,
        isToUsers: true,
        isToLists: false,
        isToPersona: false,
        isToFilters: false,
        isCampusWide: false,
        validUserCount: false
      };
      this.form.controls['list_ids'].setValue([]);
      this.form.controls['user_ids'].setValue([]);
      this.form.controls['is_school_wide'].setValue(false);
    }

    if (audienceState.dynamic) {
      this.state = {
        ...this.state,
        isToUsers: false,
        isToLists: false,
        isToFilters: true,
        isToPersona: false,
        isCampusWide: false,
        validUserCount: false
      };
      this.form.controls['filters'].setValue([]);
      this.form.controls['user_ids'].setValue([]);
      this.form.controls['list_ids'].setValue([]);
      this.form.controls['is_school_wide'].setValue(false);
    }
  }

  onAudienceChange(audience) {
    if (audience.action) {
      this.state = {
        ...this.state,
        isToUsers: false,
        isToFilters: false,
        isCampusWide: false,
        isToLists: audience.isList,
        isToPersona: audience.isPersona,
        validUserCount: audience.userCount > 0
      };

      this.form.controls['is_school_wide'].setValue(false);
      this.hideEmergencyType(true);
      this.updatePriority();
      this.setListPersonaId(audience);
      this.getAudienceType(audience.type);
    } else {
      this.state = {
        ...this.state,
        isToUsers: false,
        isToLists: false,
        isToPersona: false,
        isCampusWide: true,
        isToFilters: false
      };
      this.form.controls['list_ids'].setValue([]);
      this.form.controls['persona_id'].setValue(null);
      this.form.controls['is_school_wide'].setValue(true);
      this.hideEmergencyType(false);
      this.updatePriority();
      this.amplitudeEventProperties = {
        ...this.amplitudeEventProperties,
        audience_type: amplitudeEvents.CAMPUS_WIDE
      };
    }
  }

  setListPersonaId(val) {
    if (val.isPersona) {
      this.form.controls['list_ids'].setValue([]);
      this.form.controls['persona_id'].setValue(val.action);
    } else {
      this.form.controls['persona_id'].setValue(null);
      this.form.controls['list_ids'].setValue([val.action]);
    }
  }

  getAudienceType(type) {
    const audience_type =
      type === AudienceType.dynamic
        ? amplitudeEvents.DYNAMIC_AUDIENCE
        : amplitudeEvents.CUSTOM_AUDIENCE;

    this.amplitudeEventProperties = {
      ...this.amplitudeEventProperties,
      audience_type
    };
  }

  updatePriority() {
    if (this.form.controls['priority'].value === this.EMERGENCY_TYPE) {
      this.form.controls['priority'].setValue(this.REGULAR_TYPE);
      this.selectedType = this.types.filter((type) => type.action === this.REGULAR_TYPE)[0];
      this.subject_prefix = {
        label: null,
        type: null
      };
    }
  }

  hideEmergencyType(setValue) {
    this.types = this.types.map((type) => {
      if (type.action === this.EMERGENCY_TYPE) {
        type = { ...type, disabled: setValue };
      }

      return type;
    });
  }

  onSelectedUsers(users) {
    this.state = {
      ...this.state,
      isToUsers: true,
      isToLists: false,
      isCampusWide: false,
      isToFilters: false,
      validUserCount: users.length > 0
    };

    this.form.controls['list_ids'].setValue([]);
    this.form.controls['user_ids'].setValue(users);
    this.form.controls['is_school_wide'].setValue(false);

    this.validButton();
  }

  getSubjectLength(): string {
    let length = '';

    if (this.subject_prefix.label) {
      length += this.subject_prefix.label;
    }

    if (this.form.controls['subject'].value) {
      length += this.form.controls['subject'].value;
    }

    return length;
  }

  onSelectedStore(store) {
    this.sendAsName = store.label;
    this.form.controls['store_id'].setValue(store.value);
    this.amplitudeEventProperties = {
      ...this.amplitudeEventProperties,
      host_type: store.hostType
    };
  }

  onTeardownAudienceSaveModal() {
    $('#audienceSaveModal').modal('hide');
  }

  onTeardownConfirm() {
    this.shouldConfirm = false;
    this.buttonData = { ...this.buttonData, disabled: false };
  }

  onAudienceNamed({ name }) {
    $('#audienceSaveModal').modal('hide');

    let data = {};
    data = { ...data, name };

    if (this.state.isToUsers) {
      data = { ...data, user_ids: this.form.value.user_ids };
    }

    if (this.state.isToFilters) {
      data = { ...data, filters: this.form.value.filters };
    }

    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service
      .createAudience(data, search)
      .toPromise()
      .then(({ id }: any) => {
        this.redirectToSaveTab({ id });
        this.trackCreateAudience(data);
      })
      .catch((err) => {
        const error = parseErrorResponse(err.error);
        const body =
          error === 'Database Error'
            ? this.cpI18n.translate('audience_create_error_duplicate_audience')
            : this.cpI18n.translate('something_went_wrong');

        this.store.dispatch({
          type: baseActions.SNACKBAR_SHOW,
          payload: {
            sticky: true,
            class: 'danger',
            body
          }
        });

        this.buttonData = {
          ...this.buttonData,
          disabled: false
        };
      });
  }

  trackCreateAudience(audience) {
    let eventProperties = this.audienceUtils.getAmplitudeEvent(audience, true);
    eventProperties = { ...eventProperties, menu_name: amplitudeEvents.MENU_NOTIFY };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CREATED_AUDIENCE, eventProperties);
  }

  trackImportAudience() {
    const eventProperties = { menu_name: amplitudeEvents.MENU_NOTIFY };
    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_IMPORTED_AUDIENCE, eventProperties);
  }

  onResetNewAudience() {
    this.state = {
      ...this.state,
      isToUsers: false,
      isToLists: false,
      isToFilters: true,
      isCampusWide: false,
      validUserCount: false
    };

    this.form.controls['is_school_wide'].setValue(false);

    this.hideEmergencyType(true);
    this.updatePriority();
  }

  onResetSavedAudience() {
    this.state = {
      ...this.state,
      isToUsers: false,
      isToLists: false,
      isCampusWide: true,
      isToFilters: false,
      validUserCount: true
    };

    this.form.controls['is_school_wide'].setValue(true);

    this.hideEmergencyType(false);
  }

  doValidate() {
    this.shouldConfirm = this.state.isEmergency || this.state.isCampusWide || this.state.isUrgent;

    if (!this.shouldConfirm) {
      this.doSubmit();
    } else {
      setTimeout(
        () => {
          $('#announcementConfirmModal').modal();
        },

        1
      );
    }
  }

  onUsersCount(usersCount) {
    this.state = {
      ...this.state,
      validUserCount: usersCount > 0 || usersCount === 'campus_wide'
    };

    this.validButton();
  }

  doSubmit() {
    this.isError = false;
    $('#announcementConfirmModal').modal('hide');

    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    const prefix = this.subject_prefix.label ? this.subject_prefix.label.toUpperCase() : '';

    let data = {
      store_id: this.form.value.store_id,
      is_school_wide: this.form.value.is_school_wide,
      subject: `${prefix} ${this.form.value.subject}`,
      message: `${this.form.value.message} \n ${this.sendAsName}`,
      priority: this.form.value.priority
    };

    if (this.state.isToUsers && !this.state.isCampusWide) {
      this.amplitudeEventProperties = {
        ...this.amplitudeEventProperties,
        audience_type: amplitudeEvents.CUSTOM_AUDIENCE
      };
      data = Object.assign({}, data, { user_ids: this.form.value.user_ids });

      delete data['filters'];
      delete data['list_ids'];
      delete data['persona_id'];
    }

    if (this.state.isToLists && !this.state.isCampusWide) {
      data = Object.assign({}, data, { list_ids: this.form.value.list_ids });

      delete data['filters'];
      delete data['user_ids'];
      delete data['persona_id'];
    }

    if (this.state.isToFilters && !this.state.isCampusWide) {
      this.amplitudeEventProperties = {
        ...this.amplitudeEventProperties,
        audience_type: amplitudeEvents.DYNAMIC_AUDIENCE
      };
      data = Object.assign({}, data, { filters: this.form.value.filters });

      delete data['list_ids'];
      delete data['user_ids'];
      delete data['persona_id'];
    }

    if (this.state.isToPersona && !this.state.isCampusWide) {
      this.amplitudeEventProperties = {
        ...this.amplitudeEventProperties,
        audience_type: amplitudeEvents.EXPERIENCE
      };

      data = Object.assign({}, data, { persona_id: this.form.value.persona_id });

      delete data['filters'];
      delete data['list_ids'];
      delete data['user_ids'];
    }

    this.service.postAnnouncements(search, data).subscribe(
      (res: any) => {
        if (res.status === THROTTLED_STATUS) {
          this.shouldConfirm = false;

          this.isError = true;
          this.errorMessage = `Message not sent, \n
          please wait ${(res.timeout / 60).toFixed()} minutes before trying again`;

          return;
        }

        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.NOTIFY_SEND_ANNOUNCEMENT,
          this.amplitudeEventProperties
        );
        this.router.navigate(['/notify/announcements']);
      },
      (_) => {
        this.isError = true;
        this.shouldConfirm = false;
        this.errorMessage = STATUS.SOMETHING_WENT_WRONG;
      }
    );
  }

  onConfirmed() {
    this.doSubmit();
  }

  onTypeChanged(type): void {
    this.subject_prefix = {
      label: null,
      type: null
    };
    this.state.isUrgent = type.action === this.URGENT_TYPE;
    this.state.isEmergency = type.action === this.EMERGENCY_TYPE;

    if (this.state.isEmergency) {
      this.subject_prefix = {
        label: this.cpI18n.translate('emergency'),
        type: 'danger'
      };
    }

    if (this.state.isUrgent) {
      this.subject_prefix = {
        label: this.cpI18n.translate('urgent'),
        type: 'warning'
      };
    }

    this.form.controls['priority'].setValue(type.action);
    this.selectedType = this.getObjectFromTypesArray(type.action);
    this.amplitudeEventProperties = {
      ...this.amplitudeEventProperties,
      announcement_type: type.label
    };
  }

  getObjectFromTypesArray(id) {
    let result;

    this.types.forEach((type) => {
      if (type.action === id) {
        result = type;
      }
    });

    return result;
  }

  onSelectedFilters(filters) {
    this.state = {
      ...this.state,
      isToUsers: false,
      isToLists: false,
      isCampusWide: false,
      isToFilters: true
    };

    this.form.controls['filters'].setValue(filters);
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'announcements_heading_create',
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  onImportClick() {
    this.isAudienceImport = true;

    setTimeout(
      () => {
        $('#audienceImport').modal();
      },

      1
    );
  }

  onSaveAudienceClick() {
    $('#audienceSaveModal').modal();
  }

  validButton() {
    const isValid = this.form.valid && this.state.validUserCount;

    this.buttonData = { ...this.buttonData, disabled: !isValid };
  }

  ngOnDestroy() {
    this.store.dispatch({ type: baseActions.AUDIENCE_RESET_IMPORT_AUDIENCE });
  }

  ngOnInit() {
    this.canReadAudience = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.audience);

    this.buildHeader();

    this.buttonData = {
      text: this.cpI18n.translate('send'),
      class: 'primary',
      disabled: true
    };
    const host_type = this.session.defaultHost ? this.session.defaultHost.hostType : null;
    this.amplitudeEventProperties = {
      ...this.amplitudeEventProperties,
      audience_type: amplitudeEvents.CAMPUS_WIDE,
      sub_menu_name: amplitudeEvents.ANNOUNCEMENT,
      host_type
    };
    const defaultHost = this.session.defaultHost ? this.session.defaultHost.value : null;

    this.sendAsName = this.session.defaultHost ? this.session.defaultHost.label : undefined;

    let canDoEmergency;

    const schoolPrivileges = this.session.g.get('user').school_level_privileges[
      this.session.g.get('school').id
    ];

    try {
      canDoEmergency = schoolPrivileges[CP_PRIVILEGES_MAP.emergency_announcement].w;
    } catch (error) {
      canDoEmergency = false;
    }

    this.types = require('./announcement-types').types;

    if (!canDoEmergency) {
      this.types = this.types.filter((type) => type.action !== this.EMERGENCY_TYPE);
    }

    this.form = this.fb.group({
      store_id: [defaultHost, Validators.required],
      user_ids: [[]],
      list_ids: [[]],
      filters: [[]],
      persona_id: [null],
      is_school_wide: true,
      subject: [null, [CustomValidators.requiredNonEmpty, Validators.maxLength(128)]],
      message: [null, [CustomValidators.requiredNonEmpty, Validators.maxLength(400)]],
      priority: [this.types[0].action, Validators.required]
    });

    this.form.valueChanges.subscribe((_) => {
      this.validButton();
    });
  }
}
