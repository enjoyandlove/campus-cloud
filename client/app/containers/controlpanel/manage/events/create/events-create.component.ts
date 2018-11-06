import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { isProd } from './../../../../../config/env';
import { baseActions } from '../../../../../store/base';
import { EventUtilService } from '../events.utils.service';
import { CPSession, ISchool } from '../../../../../session';
import { CPDate, CPMap } from '../../../../../shared/utils';
import { EventsComponent } from '../list/base/events.component';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';
import {
  isAllDay,
  CheckInMethod,
  EventFeedback,
  attendanceType,
  EventAttendance
} from '../event.status';

import {
  AdminService,
  CPI18nService,
  CPTrackingService,
  ErrorService,
  StoreService
} from '../../../../../shared/services';

const FORMAT_WITH_TIME = 'F j, Y h:i K';
const FORMAT_WITHOUT_TIME = 'F j, Y';
const COMMON_DATE_PICKER_OPTIONS = {
  utc: true,
  enableTime: true
};

@Component({
  selector: 'cp-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent extends EventsComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isAthletic: boolean;
  @Input() isService: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;
  @Input() toolTipContent: IToolTipContent;

  stores$;
  urlPrefix;
  buttonData;
  isDateError;
  eventQRCodes;
  school: ISchool;
  form: FormGroup;
  attendanceTypes;
  dateErrorMessage;
  formError = false;
  attendanceFeedback;
  attendance = false;
  enddatePickerOpts;
  startdatePickerOpts;
  eventFeedbackEnabled;
  production = isProd;
  showLocationDetails = false;
  mapCenter: BehaviorSubject<any>;
  managers: Array<any> = [{ label: '---' }];
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);

  eventProperties = {
    event_id: null,
    host_type: null,
    start_date: null,
    end_date: null,
    location: null,
    assessment: null,
    feedback: null,
    uploaded_photo: null
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeHeader: Store<any>,
    public service: EventsService,
    public utils: EventUtilService,
    public adminService: AdminService,
    public storeService: StoreService,
    public errorService: ErrorService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service);
  }

  buildHeader() {
    const payload = {
      heading: 'events_create_heading',
      subheading: null,
      em: null,
      children: []
    };

    this.storeHeader.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload
    });
  }

  onSelectedManager(manager): void {
    this.form.controls['event_manager_id'].setValue(manager.value);
  }

  onSelectedAttendanceType(type): void {
    this.form.controls['has_checkout'].setValue(type.action);
  }

  onSelectedQRCode(isEnabled: boolean): void {
    const verificationMethods = this.form.controls['attend_verification_methods'].value;

    if (isEnabled && !verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.push(CheckInMethod.app);
    } else if (!isEnabled && verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.pop(CheckInMethod.app);
    }
  }

  onSelectedHost(host): void {
    this.eventProperties = {
      ...this.eventProperties,
      host_type: host.hostType
    };

    this.fetchManagersBySelectedStore(host.value);

    this.form.controls['store_id'].setValue(host.value);
  }

  fetchManagersBySelectedStore(storeId) {
    const search: HttpParams = new HttpParams()
      .append('store_id', storeId)
      .append('school_id', this.school.id.toString())
      .append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    this.adminService
      .getAdminByStoreId(search)
      .pipe(
        map((admins: any) => {
          return [
            {
              label: '---',
              value: null
            },
            ...admins.map((admin) => {
              return {
                label: `${admin.firstname} ${admin.lastname}`,
                value: admin.id
              };
            })
          ];
        })
      )
      .subscribe(
        (managers) => (this.managers = managers),
        (err) => {
          throw new Error(err);
        }
      );
  }

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  toggleEventAttendance(value) {
    value = value ? EventAttendance.enabled : EventAttendance.disabled;

    const feedbackQuestion = !value
      ? ''
      : this.cpI18n.translate('t_events_default_feedback_question');

    this.form.controls['event_feedback'].setValue(value);
    this.form.controls['event_attendance'].setValue(value);
    this.form.controls['custom_basic_feedback_label'].setValue(feedbackQuestion);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_data'].setValue(null);
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    this.drawMarker.next(true);

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);

      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.name };

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onSubmit() {
    this.formError = false;
    this.isDateError = false;
    this.clearDateErrors();

    if (!this.form.valid) {
      this.formError = true;
      this.enableSaveButton();

      return;
    }

    if (this.form.controls['is_all_day'].value) {
      this.updateTime();
    }
    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.isDateError = true;
      this.formError = true;
      this.enableSaveButton();
      this.form.controls['end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_before_start');

      return;
    }

    if (this.form.controls['end'].value <= Math.round(CPDate.now(this.session.tz).unix())) {
      this.isDateError = true;
      this.formError = true;
      this.enableSaveButton();
      this.form.controls['end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_after_now');

      return;
    }

    let search = new HttpParams();
    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    this.service.createEvent(this.form.value, search).subscribe(
      (res: any) => {
        this.eventProperties = {
          ...this.eventProperties,
          ...this.utils.setEventProperties(this.form.controls),
          event_id: res.id
        };

        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_CREATED_EVENT,
          this.eventProperties
        );

        this.urlPrefix = this.getUrlPrefix(res.id);
        this.router.navigate([this.urlPrefix]);
      },
      (err) => {
        this.enableSaveButton();
        this.errorService.handleError(err);
      }
    );
  }

  clearDateErrors() {
    if (this.form.controls['start'].value) {
      this.form.controls['start'].setErrors(null);
    }

    if (this.form.controls['end'].value) {
      this.form.controls['end'].setErrors(null);
    }
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  getUrlPrefix(event_id) {
    const eventType = {
      ...this.getEventType(),
      event_id
    };

    return this.utils.buildUrlPrefixEvents(eventType);
  }

  onEventFeedbackChange(option) {
    const feedbackQuestion = !option.action
      ? ''
      : this.cpI18n.translate('t_events_default_feedback_question');

    this.form.controls['event_feedback'].setValue(option.action);
    this.form.controls['custom_basic_feedback_label'].setValue(feedbackQuestion);
  }

  toggleDatePickerTime(checked) {
    const dateFormat = checked ? FORMAT_WITHOUT_TIME : FORMAT_WITH_TIME;

    this.startdatePickerOpts = {
      ...this.startdatePickerOpts,
      enableTime: !checked,
      dateFormat
    };

    this.enddatePickerOpts = {
      ...this.enddatePickerOpts,
      enableTime: !checked,
      dateFormat
    };
  }

  updateTime() {
    const startDateAtMidnight = CPDate.fromEpoch(
      this.form.controls['start'].value,
      this.session.tz
    ).startOf('day');

    const endDateAtMidnight = CPDate.fromEpoch(
      this.form.controls['end'].value,
      this.session.tz
    ).endOf('day');

    this.form.controls['start'].setValue(CPDate.toEpoch(startDateAtMidnight, this.session.tz));
    this.form.controls['end'].setValue(CPDate.toEpoch(endDateAtMidnight, this.session.tz));
  }

  onAllDayToggle(value) {
    this.toggleDatePickerTime(value);
    this.form.controls['is_all_day'].setValue(value);
  }

  onLocationToggle(value) {
    this.showLocationDetails = value;

    if (!value) {
      this.drawMarker.next(false);

      this.mapCenter = new BehaviorSubject({
        lat: this.school.latitude,
        lng: this.school.longitude
      });

      this.form.controls['room_data'].setValue(null);
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    }
  }

  trackCancelEvent() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(this.form.controls),
      uploaded_photo: this.utils.didUploadPhoto(this.form.controls['poster_url'].value)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CANCELED_EVENT, this.eventProperties);
  }

  setStart(date) {
    this.form.controls['start'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setEnd(date) {
    this.form.controls['end'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  ngOnInit() {
    const host_type = this.session.defaultHost ? this.session.defaultHost.hostType : null;

    this.eventProperties = {
      ...this.eventProperties,
      host_type
    };

    this.eventFeedbackEnabled = EventFeedback.enabled;

    this.school = this.session.g.get('school');
    const search: HttpParams = new HttpParams().append('school_id', this.school.id.toString());
    this.buildHeader();

    this.stores$ = this.storeService.getStores(search);

    let store_id = this.session.defaultHost ? this.session.defaultHost.value : null;

    // fetch managers by service
    if (this.storeId) {
      store_id = this.storeId;
      this.fetchManagersBySelectedStore(this.storeId);
    }

    // fetch managers by club
    if (this.clubId) {
      store_id = this.clubId;
      this.fetchManagersBySelectedStore(this.clubId);
    }

    if (this.isOrientation) {
      this.fetchManagersBySelectedStore(null);
    } else if (this.session.defaultHost) {
      this.fetchManagersBySelectedStore(store_id);
    }

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('events_button_new')
    };

    this.mapCenter = new BehaviorSubject({
      lat: this.school.latitude,
      lng: this.school.longitude
    });

    this.eventQRCodes = this.utils.getQROptions();
    this.attendanceTypes = this.utils.getAttendanceTypeOptions();
    this.attendanceFeedback = this.utils.getAttendanceFeedback();
    const defaultFeedbackQuestion = this.cpI18n.translate('t_events_default_feedback_question');

    this.form = this.fb.group(
      {
        city: [null],
        latitude: [0],
        longitude: [0],
        country: [null],
        address: [null],
        location: [null],
        province: [null],
        room_data: [null],
        postal_code: [null],
        description: [null],
        event_manager_id: [null],
        is_all_day: [isAllDay.disabled],
        end: [null, Validators.required],
        attendance_manager_email: [null],
        start: [null, Validators.required],
        title: [null, Validators.required],
        poster_url: [null, Validators.required],
        event_feedback: [EventFeedback.enabled],
        has_checkout: [attendanceType.checkInOnly],
        event_attendance: [EventAttendance.disabled],
        poster_thumb_url: [null, Validators.required],
        custom_basic_feedback_label: [defaultFeedbackQuestion],
        store_id: [store_id ? store_id : null, !this.isOrientation ? Validators.required : null],
        attend_verification_methods: [[CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app]]
      },
      { validator: this.utils.assessmentEnableCustomValidator }
    );

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS
    };

    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS
    };
  }
}
