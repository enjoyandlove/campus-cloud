import { BehaviorSubject, combineLatest, of as observableOf } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { FORMAT } from '@shared/pipes/date';
import { CPDate, CPMap } from '@shared/utils';
import { EventsService } from '../events.service';
import { CPSession, ISchool } from '@app/session';
import { baseActions, IHeader } from '@app/store/base';
import { CustomValidators } from '@shared/validators';
import { EventUtilService } from '../events.utils.service';
import { amplitudeEvents } from '@shared/constants/analytics';
import { CPI18nService } from '@shared/services/i18n.service';
import { EventsComponent } from '../list/base/events.component';
import { EventAttendance, EventFeedback } from './../event.status';
import { CheckInMethod } from '@containers/controlpanel/manage/events/event.status';
import {
  RouteLevel,
  AdminService,
  CPTrackingService,
  ErrorService,
  StoreService
} from '@shared/services';

const FORMAT_WITH_TIME = 'F j, Y h:i K';
const FORMAT_WITHOUT_TIME = 'F j, Y';
const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
};

@Component({
  selector: 'cp-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent extends EventsComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() athleticId: number;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;

  event;
  stores;
  urlPrefix;
  buttonData;
  dateFormat;
  serverError;
  isDateError;
  originalHost;
  eventQRCodes;
  selectedQRCode;
  loading = true;
  attendanceTypes;
  school: ISchool;
  eventId: number;
  form: FormGroup;
  selectedManager;
  dateErrorMessage;
  enddatePickerOpts;
  attendanceEnabled;
  attendanceFeedback;
  attendance = false;
  isFormReady = false;
  startdatePickerOpts;
  originalAttnFeedback;
  eventFeedbackEnabled;
  selectedAttendanceType;
  attendanceFeedbackLabel;
  formMissingFields = false;
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
    feedback: null
  };

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    public utils: EventUtilService,
    private adminService: AdminService,
    public storeService: StoreService,
    private errorService: ErrorService,
    public service: EventsService,
    public cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service);
    this.school = this.session.g.get('school');
    this.eventId = this.route.snapshot.params['eventId'];

    super.isLoading().subscribe((res) => (this.loading = res));
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

  onSubmit(data) {
    this.clearDateErrors();
    this.isDateError = false;
    this.formMissingFields = false;

    if (!this.form.valid) {
      this.enableSaveButton();
      this.formMissingFields = true;

      return;
    }

    if (this.form.controls['is_all_day'].value) {
      this.updateTime();
    }

    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.enableSaveButton();
      this.isDateError = true;
      this.formMissingFields = true;
      this.form.controls['end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_before_start');

      return;
    }

    if (this.form.controls['end'].value <= CPDate.now(this.session.tz).unix()) {
      this.enableSaveButton();
      this.isDateError = true;
      this.formMissingFields = true;
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

    this.service.updateEvent(data, this.eventId, search).subscribe(
      (_) => {
        this.trackQrCode(data);

        this.eventProperties = {
          ...this.eventProperties,
          ...this.utils.setEventProperties(this.form.controls),
          event_id: this.eventId
        };

        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_UPDATED_EVENT,
          this.eventProperties
        );
        this.router.navigate([this.urlPrefix]);
      },
      (_) => {
        this.serverError = true;
        this.enableSaveButton();
      }
    );
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  clearDateErrors() {
    if (this.form.controls['start'].value) {
      this.form.controls['start'].setErrors(null);
    }

    if (this.form.controls['end'].value) {
      this.form.controls['end'].setErrors(null);
    }
  }

  public buildForm(res) {
    this.attendanceFeedbackLabel = res.custom_basic_feedback_label
      ? res.custom_basic_feedback_label
      : this.cpI18n.translate('t_events_default_feedback_question');

    const poster_url = res.poster_url ? res.poster_url : res.store_logo_url;
    const thumb_url = res.poster_thumb_url ? res.poster_thumb_url : res.store_logo_url;

    this.form = this.fb.group(
      {
        city: [res.city],
        country: [res.country],
        address: [res.address],
        latitude: [res.latitude],
        location: [res.location],
        province: [res.province],
        room_data: [res.room_data],
        longitude: [res.longitude],
        is_all_day: [res.is_all_day],
        description: [res.description],
        postal_code: [res.postal_code],
        has_checkout: [res.has_checkout],
        end: [res.end, Validators.required],
        event_feedback: [res.event_feedback],
        title: [
          res.title,
          Validators.compose([Validators.required, CustomValidators.requiredNonEmpty])
        ],
        start: [res.start, Validators.required],
        event_attendance: [res.event_attendance],
        event_manager_id: [res.event_manager_id],
        poster_url: [poster_url, Validators.required],
        poster_thumb_url: [thumb_url, Validators.required],
        attendance_manager_email: [res.attendance_manager_email],
        custom_basic_feedback_label: [res.custom_basic_feedback_label],
        attend_verification_methods: [res.attend_verification_methods],
        store_id: [res.store_id, !this.isOrientation ? Validators.required : null],
        calendar_id: [this.orientationId, this.isOrientation ? Validators.required : null]
      },
      { validator: this.utils.assessmentEnableCustomValidator }
    );

    this.updateDatePicker();
    this.fetchManagersBySelectedStore(res.store_id);

    this.originalAttnFeedback = this.getFromArray(
      this.attendanceFeedback,
      'action',
      res.event_feedback
    );

    this.selectedAttendanceType = this.getFromArray(
      this.utils.getAttendanceTypeOptions(),
      'action',
      res.has_checkout
    );

    this.selectedQRCode = this.getFromArray(
      this.utils.getQROptions(),
      'action',
      this.getQRCodeStatus(res.attend_verification_methods)
    );

    this.originalHost = this.getFromArray(this.stores, 'value', res.store_id);

    const host_type = this.originalHost ? this.originalHost.hostType : null;

    this.eventProperties = {
      ...this.eventProperties,
      host_type
    };

    this.isFormReady = true;
  }

  getQRCodeStatus(qrCodes) {
    return qrCodes.includes(CheckInMethod.app);
  }

  setStart(date) {
    this.form.controls['start'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setEnd(date) {
    this.form.controls['end'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  updateDatePicker() {
    const _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpochLocal(
        this.form.controls['start'].value,
        _self.session.tz
      ).format()
    };
    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpochLocal(this.form.controls['end'].value, _self.session.tz).format()
    };
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

  onAllDayToggle(value) {
    this.toggleDatePickerTime(value);
    this.form.controls['is_all_day'].setValue(value);
  }

  onSelectedHost(host): void {
    this.eventProperties = {
      ...this.eventProperties,
      host_type: host.hostType
    };

    this.selectedManager = null;
    this.fetchManagersBySelectedStore(host.value);
    this.form.controls['store_id'].setValue(host.value);
  }

  fetchManagersBySelectedStore(storeId) {
    let search: HttpParams = new HttpParams()
      .append('school_id', this.school.id.toString())
      .append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    if (!this.isOrientation) {
      search = search.append('store_id', storeId);
    }

    this.adminService
      .getAdminByStoreId(search)
      .pipe(
        map((admins: Array<any>) => {
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
      .subscribe((res) => {
        this.managers = res;
        this.selectedManager = this.managers.filter(
          (manager) => manager.value === this.form.controls['event_manager_id'].value
        )[0];
      });
  }

  public fetch() {
    let stores$ = observableOf([]);
    const school = this.session.g.get('school');
    const orientationId = this.orientationId ? this.orientationId.toString() : null;
    const search: HttpParams = new HttpParams()
      .append('school_id', school.id.toString())
      .append('calendar_id', orientationId);

    if (!this.isClub && !this.isService && !this.isOrientation) {
      stores$ = this.storeService.getStores(search);
    }

    const event$ = this.service.getEventById(this.eventId, search);
    const stream$ = combineLatest(event$, stores$);

    super
      .fetchData(stream$)
      .then((res) => {
        this.stores = res.data[1];
        this.event = res.data[0];
        this.buildForm(res.data[0]);
        const lat = res.data[0].latitude;
        const lng = res.data[0].longitude;

        this.mapCenter = new BehaviorSubject(CPMap.setDefaultMapCenter(lat, lng, this.school));

        this.showLocationDetails = CPMap.canViewLocation(lat, lng, this.school);
        this.drawMarker.next(this.showLocationDetails);
      })
      .catch((err) => this.errorService.handleError(err));
  }

  public buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'events_edit_event',
        subheading: '',
        children: []
      }
    });
  }

  getFromArray(arr: Array<any>, key: string, val: any) {
    return arr.filter((item) => item[key] === val)[0];
  }

  enableStudentFeedbackOnAttendanceToggle(value) {
    const attendanceLabel = value ? this.attendanceFeedbackLabel : '';

    this.form.controls['event_feedback'].setValue(value);
    this.form.controls['custom_basic_feedback_label'].setValue(attendanceLabel);
    this.originalAttnFeedback = this.getFromArray(this.attendanceFeedback, 'action', value);
  }

  toggleEventAttendance(value) {
    value = value ? EventAttendance.enabled : EventAttendance.disabled;

    this.selectedQRCode = this.eventQRCodes[0];
    this.enableStudentFeedbackOnAttendanceToggle(value);
    this.form.controls['event_attendance'].setValue(value);
    this.form.controls['attend_verification_methods'].setValue([
      CheckInMethod.web,
      CheckInMethod.webQr,
      CheckInMethod.app
    ]);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_data'].setValue('');
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

  onEventFeedbackChange(option) {
    const feedbackQuestion = !option.action
      ? ''
      : this.cpI18n.translate('t_events_default_feedback_question');

    this.form.controls['event_feedback'].setValue(option.action);
    this.form.controls['custom_basic_feedback_label'].setValue(feedbackQuestion);
  }

  onLocationToggle(value) {
    this.showLocationDetails = value;

    if (!value) {
      this.drawMarker.next(false);

      this.mapCenter = new BehaviorSubject({
        lat: this.school.latitude,
        lng: this.school.longitude
      });

      this.form.controls['room_data'].setValue('');
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    }
  }

  trackQrCode(event) {
    const eventProperties = {
      ...this.utils.getQRCodeCheckOutStatus(event, true),
      source_id: this.event.encrypted_id,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second),
      assessment_type: this.utils.getEventCategoryType(this.event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CHANGED_QR_CODE, eventProperties);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('save'),
      class: 'primary'
    };

    const eventType = {
      ...this.getEventType(),
      event_id: this.eventId
    };

    this.urlPrefix = this.utils.buildUrlPrefixEvents(eventType);

    this.dateFormat = FORMAT.DATETIME;
    this.attendanceEnabled = EventAttendance.enabled;
    this.eventFeedbackEnabled = EventFeedback.enabled;
    this.eventQRCodes = this.utils.getQROptions();
    this.attendanceTypes = this.utils.getAttendanceTypeOptions();
    this.attendanceFeedback = this.utils.getAttendanceFeedback();
    this.fetch();
    this.buildHeader();
  }
}
