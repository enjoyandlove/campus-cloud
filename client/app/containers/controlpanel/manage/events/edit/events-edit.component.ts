import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { isProd } from './../../../../../config/env';
import { FORMAT } from '../../../../../shared/pipes/date';
import { CPSession, ISchool } from '../../../../../session';
import { CPMap, CPDate } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base/base.component';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { ErrorService, StoreService, AdminService } from '../../../../../shared/services';

import { EventAttendance, EventFeedback } from '../event.status';
import { EventUtilService } from '../events.utils.service';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';

const FORMAT_WITH_TIME = 'F j, Y h:i K';
const FORMAT_WITHOUT_TIME = 'F j, Y';
const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-events-edit',
  templateUrl: './events-edit.component.html',
  styleUrls: ['./events-edit.component.scss']
})
export class EventsEditComponent extends BaseComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() isService: boolean;
  @Input() isAthletic: number;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;
  @Input() toolTipContent: IToolTipContent;

  event;
  stores;
  urlPrefix;
  buttonData;
  dateFormat;
  serverError;
  isDateError;
  originalHost;
  booleanOptions;
  loading = true;
  school: ISchool;
  eventId: number;
  form: FormGroup;
  selectedManager;
  dateErrorMessage;
  enddatePickerOpts;
  attendanceEnabled;
  attendance = false;
  isFormReady = false;
  startdatePickerOpts;
  originalAttnFeedback;
  eventFeedbackEnabled;
  eventManagerToolTip;
  production = isProd;
  studentFeedbackToolTip;
  attendanceManagerToolTip;
  formMissingFields = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  managers: Array<any> = [{ label: '---' }];

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private utils: EventUtilService,
    private adminService: AdminService,
    public storeService: StoreService,
    private errorService: ErrorService,
    public service: EventsService
  ) {
    super();
    this.school = this.session.g.get('school');
    this.eventId = this.route.snapshot.params['eventId'];

    super.isLoading().subscribe((res) => (this.loading = res));
  }

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);
  }

  onSubmit(data) {
    this.isDateError = false;
    this.formMissingFields = false;

    if (this.form.controls['event_attendance'].value === 1) {
      const managerId = this.form.controls['event_manager_id'];
      const eventFeedback = this.form.controls['event_feedback'];

      if (managerId.value === null) {
        this.formMissingFields = true;
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
        managerId.setErrors({ required: true });
      }

      if (eventFeedback.value === null) {
        this.formMissingFields = true;
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
        eventFeedback.setErrors({ required: true });
      }
    }

    if (!this.form.valid) {
      if (!this.form.controls['poster_url'].valid) {
        this.form.controls['poster_url'].setErrors({ required: true });
      }
      this.formMissingFields = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.isDateError = true;
      this.formMissingFields = true;
      this.form.controls['end'].setErrors({ required: true });
      this.form.controls['start'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_before_start');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    if (this.form.controls['end'].value <= CPDate.now().unix()) {
      this.isDateError = true;
      this.formMissingFields = true;
      this.form.controls['end'].setErrors({ required: true });
      this.form.controls['start'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_after_now');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    if (this.form.controls['is_all_day'].value) {
      this.updateTime();
    }

    const search = new URLSearchParams();
    if (this.orientationId) {
      search.append('school_id', this.session.g.get('school').id);
      search.append('calendar_id', this.orientationId.toString());
    }

    this.service.updateEvent(data, this.eventId, search).subscribe(
      (_) => {
        this.router.navigate([this.urlPrefix]);
      },
      (_) => {
        this.serverError = true;
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      }
    );
  }

  public buildForm(res) {
    this.form = this.fb.group({
      title: [res.title, Validators.required],
      store_id: [res.store_id, !this.isOrientation ? Validators.required : null],
      calendar_id: [this.orientationId, this.isOrientation ? Validators.required : null],
      location: [res.location],
      room_data: [res.room_data],
      city: [res.city],
      province: [res.province],
      country: [res.country],
      address: [res.address],
      postal_code: [res.postal_code],
      latitude: [res.latitude],
      longitude: [res.longitude],
      event_attendance: [res.event_attendance],
      start: [res.start, Validators.required],
      end: [res.end, Validators.required],
      poster_url: [res.poster_url, Validators.required],
      poster_thumb_url: [res.poster_thumb_url, Validators.required],
      description: [res.description],
      event_feedback: [res.event_feedback],
      event_manager_id: [res.event_manager_id],
      attendance_manager_email: [res.attendance_manager_email],
      custom_basic_feedback_label: [res.custom_basic_feedback_label],
      is_all_day: [res.is_all_day]
    });

    this.updateDatePicker();
    this.fetchManagersBySelectedStore(res.store_id);

    this.originalAttnFeedback = this.getFromArray(
      this.booleanOptions,
      'action',
      res.event_feedback
    );

    this.originalHost = this.getFromArray(this.stores, 'value', res.store_id);

    this.isFormReady = true;
  }

  updateDatePicker() {
    const _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['start'].value, _self.session.tz).format(),
      onClose: function(_, dateStr) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(dateStr, _self.session.tz));
      }
    };
    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['end'].value, _self.session.tz).format(),
      onClose: function(_, dateStr) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(dateStr, _self.session.tz));
      }
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

  onAllDayToggle(value) {
    this.toggleDatePickerTime(value);
    this.form.controls['is_all_day'].setValue(value);
  }

  onSelectedHost(host): void {
    this.selectedManager = null;
    this.fetchManagersBySelectedStore(host.value);
    this.form.controls['store_id'].setValue(host.value);
  }

  fetchManagersBySelectedStore(storeId) {
    const search: URLSearchParams = new URLSearchParams();
    storeId = null;
    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeId);
    search.append('privilege_type', this.utils.getPrivilegeType(this.isOrientation));

    this.adminService
      .getAdminByStoreId(search)
      .map((admins) => {
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
      .subscribe((res) => {
        this.managers = res;
        this.selectedManager = this.managers.filter(
          (manager) => manager.value === this.form.controls['event_manager_id'].value
        )[0];
      });
  }

  public fetch() {
    let stores$ = Observable.of([]);
    const school = this.session.g.get('school');
    const orientationId = this.orientationId ? this.orientationId.toString() : null;
    const search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());
    search.append('calendar_id', orientationId);

    if (!this.isClub && !this.isService && !this.isOrientation) {
      stores$ = this.storeService.getStores(search);
    }

    const event$ = this.service.getEventById(this.eventId, search);
    const stream$ = Observable.combineLatest(event$, stores$);

    super
      .fetchData(stream$)
      .then((res) => {
        this.stores = res.data[1];
        this.event = res.data[0];
        this.buildForm(res.data[0]);

        this.mapCenter = new BehaviorSubject({
          lat: res.data[0].latitude,
          lng: res.data[0].longitude
        });
      })
      .catch((err) => this.errorService.handleError(err));
  }

  public buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
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
    this.form.controls['event_feedback'].setValue(value);
    this.originalAttnFeedback = this.getFromArray(this.booleanOptions, 'action', value);
  }

  toggleEventAttendance(value) {
    value = value ? EventAttendance.enabled : EventAttendance.disabled;

    this.enableStudentFeedbackOnAttendanceToggle(value);

    this.form.controls['event_attendance'].setValue(value);
  }

  onResetMap() {
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields(this.school));
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
    this.form.controls['event_feedback'].setValue(option.action);
  }

  ngOnInit() {
    this.eventManagerToolTip = Object.assign({}, this.eventManagerToolTip, {
      content: this.cpI18n.translate('events_event_manager_tooltip')
    });
    this.attendanceManagerToolTip = Object.assign({}, this.attendanceManagerToolTip, {
      content: this.cpI18n.translate('events_attendance_manager_tooltip')
    });

    this.studentFeedbackToolTip = Object.assign({}, this.studentFeedbackToolTip, {
      content: this.cpI18n.translate('events_event_feedback_tooltip')
    });

    this.buttonData = {
      text: this.cpI18n.translate('save'),
      class: 'primary'
    };

    this.urlPrefix = this.utils.buildUrlPrefixEvents(
      this.clubId,
      this.storeId,
      this.isAthletic,
      this.orientationId,
      this.eventId
    );

    this.dateFormat = FORMAT.DATETIME;
    this.booleanOptions = [
      {
        label: this.cpI18n.translate('event_enabled'),
        action: EventAttendance.enabled
      },
      {
        label: this.cpI18n.translate('events_disabled'),
        action: EventAttendance.disabled
      }
    ];

    this.attendanceEnabled = EventAttendance.enabled;
    this.eventFeedbackEnabled = EventFeedback.enabled;
    this.fetch();
    this.buildHeader();
  }
}
