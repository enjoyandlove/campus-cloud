import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { EventsService } from '../events.service';
import { isProd } from './../../../../../config/env';
import { EventUtilService } from '../events.utils.service';
import { CPSession, ISchool } from '../../../../../session';
import { CPDate, CPMap } from '../../../../../shared/utils';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { EventAttendance, EventFeedback, isAllDay } from '../event.status';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';
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
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-events-create',
  templateUrl: './events-create.component.html',
  styleUrls: ['./events-create.component.scss']
})
export class EventsCreateComponent implements OnInit {
  @Input() storeId: number;
  @Input() isClub: boolean;
  @Input() clubId: number;
  @Input() serviceId: number;
  @Input() isAthletic: number;
  @Input() isService: boolean;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;
  @Input() toolTipContent: IToolTipContent;

  stores$;
  urlPrefix;
  buttonData;
  isDateError;
  booleanOptions;
  school: ISchool;
  form: FormGroup;
  dateErrorMessage;
  formError = false;
  attendance = false;
  enddatePickerOpts;
  startdatePickerOpts;
  eventFeedbackEnabled;
  eventManagerToolTip;
  production = isProd;
  studentFeedbackToolTip;
  attendanceManagerToolTip;
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
    private utils: EventUtilService,
    public adminService: AdminService,
    public storeService: StoreService,
    public errorService: ErrorService,
    public cpTracking: CPTrackingService
  ) {}

  buildHeader() {
    const payload = {
      heading: 'events_create_heading',
      subheading: null,
      em: null,
      children: []
    };

    this.storeHeader.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  onSelectedManager(manager): void {
    this.form.controls['event_manager_id'].setValue(manager.value);
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
    this.form.controls['event_attendance'].setValue(value);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_data'].setValue(null);
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
    this.form.controls['start'].setErrors(null);
    this.form.controls['end'].setErrors(null);

    if (!this.form.valid) {
      this.formError = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    if (this.form.controls['event_attendance'].value === EventAttendance.enabled) {
      const managerId = this.form.controls['event_manager_id'];

      if (!managerId.value) {
        this.formError = true;
        managerId.setErrors({ required: true });
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });

        return;
      }
    }

    if (this.form.controls['is_all_day'].value) {
      this.updateTime();
    }

    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.isDateError = true;
      this.formError = true;
      this.form.controls['end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_before_start');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

      return;
    }

    if (this.form.controls['end'].value <= Math.round(CPDate.now(this.session.tz).unix())) {
      this.isDateError = true;
      this.formError = true;
      this.form.controls['end'].setErrors({ required: true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_after_now');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });

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
          this.eventProperties);

        this.urlPrefix = this.getUrlPrefix(res.id);
        this.router.navigate([this.urlPrefix]);
      },
      (err) => {
        this.errorService.handleError(err);
        this.buttonData = Object.assign({}, this.buttonData, {
          disabled: false
        });
      }
    );
  }

  getUrlPrefix(eventId) {
    return this.utils.buildUrlPrefixEvents(
      this.clubId,
      this.serviceId,
      this.isAthletic,
      this.orientationId,
      eventId
    );
  }

  onEventFeedbackChange(option) {
    this.form.controls['event_feedback'].setValue(option.action);
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
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields(this.school));
    }
  }

  getEventProperties() {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(this.form.controls),
      uploaded_photo: this.utils.getUploadedPhoto(this.form.controls['poster_url'].value)
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.MANAGE_CANCELED_EVENT,
      eventProperties: this.eventProperties
    };
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

    this.eventManagerToolTip = Object.assign({}, this.eventManagerToolTip, {
      content: this.cpI18n.translate('events_event_manager_tooltip')
    });

    this.attendanceManagerToolTip = Object.assign({}, this.attendanceManagerToolTip, {
      content: this.cpI18n.translate('events_attendance_manager_tooltip')
    });

    this.studentFeedbackToolTip = Object.assign({}, this.studentFeedbackToolTip, {
      content: this.cpI18n.translate('events_event_feedback_tooltip')
    });

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

    this.booleanOptions = [
      {
        label: this.cpI18n.translate('event_enabled'),
        action: EventFeedback.enabled
      },
      {
        label: this.cpI18n.translate('events_disabled'),
        action: EventFeedback.disabled
      }
    ];

    this.mapCenter = new BehaviorSubject({
      lat: this.school.latitude,
      lng: this.school.longitude
    });

    this.form = this.fb.group({
      title: [null, Validators.required],
      store_id: [store_id ? store_id : null, !this.isOrientation ? Validators.required : null],
      location: [null],
      room_data: [null],
      city: [null],
      province: [null],
      country: [null],
      address: [null],
      postal_code: [null],
      latitude: [0],
      longitude: [0],
      event_attendance: [EventAttendance.disabled],
      start: [null, Validators.required],
      poster_url: [null, Validators.required],
      poster_thumb_url: [null, Validators.required],
      end: [null, Validators.required],
      description: [null],
      event_feedback: [EventFeedback.enabled],
      event_manager_id: [null],
      attendance_manager_email: [null],
      custom_basic_feedback_label: [null],
      is_all_day: [isAllDay.disabled]
    });

    const _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onChange: function(_, dataStr) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onChange: function(_, dataStr) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };
  }
}
