import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
import { EventsService } from '../events.service';
import { FORMAT } from '../../../../../shared/pipes/date';
import { CPSession, ISchool } from '../../../../../session';
import { CPMap, CPDate } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/constants';
import { ErrorService, StoreService, AdminService } from '../../../../../shared/services';

import { EventAttendance } from '../event.status';

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
  @Input() clubId: boolean;
  @Input() isService: boolean;

  event;
  stores;
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
  attendance = false;
  isFormReady = false;
  startdatePickerOpts;
  originalAttnFeedback;
  formMissingFields = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  managers: Array<any> = [{ 'label': '---' }];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    super();
    this.school = this.session.g.get('school');
    this.eventId = this.route.snapshot.params['eventId'];

    super.isLoading().subscribe(res => this.loading = res);

    this.fetch();
    this.buildHeader();
  }

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);
  }

  onSubmit(data) {
    this.isDateError = false;
    this.formMissingFields = false;

    if (this.form.controls['event_attendance'].value === 1) {
      let managerId = this.form.controls['event_manager_id'];
      let eventFeedback = this.form.controls['event_feedback'];

      if (managerId.value === null) {
        this.formMissingFields = true;
        this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
        managerId.setErrors({ 'required': true });
      }

      if (eventFeedback.value === null) {
        this.formMissingFields = true;
        this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
        eventFeedback.setErrors({ 'required': true });
      }
    }

    if (!this.form.valid) {
      if (!this.form.controls['poster_url'].valid) {
        this.form.controls['poster_url'].setErrors({ 'required': true });
      }
      this.formMissingFields = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      return;
    }

    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.isDateError = true;
      this.formMissingFields = true;
      this.form.controls['end'].setErrors({ 'required': true });
      this.form.controls['start'].setErrors({ 'required': true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_before_start');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      return;
    }

    if (this.form.controls['end'].value <= Math.round(new Date().getTime() / 1000)) {
      this.isDateError = true;
      this.formMissingFields = true;
      this.form.controls['end'].setErrors({ 'required': true });
      this.form.controls['start'].setErrors({ 'required': true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_after_now');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      return;
    }

    this
      .eventService
      .updateEvent(data, this.eventId)
      .subscribe(
      _ => {
        if (this.isService) {
          this.router.navigate([`/manage/services/${this.storeId}/events/${this.eventId}`]);
          return;
        }
        if (this.isClub) {
          this.router.navigate([`/manage/clubs/${this.clubId}/events/${this.eventId}`]);
          return;
        }
        this.router.navigate(['/manage/events/' + this.eventId]);
      },
      _ => {
        this.serverError = true;
        this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      }
      );
  }

  private buildForm(res) {
    this.form = this.fb.group({
      'title': [res.title, Validators.required],
      'store_id': [res.store_id, Validators.required],
      'location': [res.location],
      'room_data': [res.room_data],
      'city': [res.city],
      'province': [res.province],
      'country': [res.country],
      'address': [res.address],
      'postal_code': [res.postal_code],
      'latitude': [res.latitude],
      'longitude': [res.longitude],
      'event_attendance': [res.event_attendance],
      'start': [res.start, Validators.required],
      'end': [res.end, Validators.required],
      'poster_url': [res.poster_url, Validators.required],
      'poster_thumb_url': [res.poster_thumb_url, Validators.required],
      'description': [res.description],
      'event_feedback': [res.event_feedback],
      'event_manager_id': [res.event_manager_id],
      'attendance_manager_email': [res.attendance_manager_email],
      'custom_basic_feedback_label': [res.custom_basic_feedback_label]
    });

    this.updateDatePicker();
    this.fetchManagersBySelectedStore(res.store_id);

    this.originalAttnFeedback = this
      .getFromArray(this.booleanOptions, 'action', res.event_feedback);

    this.originalHost = this
      .getFromArray(this.stores, 'value', res.store_id);

    this.isFormReady = true;
  }

  updateDatePicker() {
    let _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['start'].value),
      onClose: function (date) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(date[0]));
      }
    };
    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['end'].value),
      onClose: function (date) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(date[0]));
      }
    };
  }

  onSelectedManager(manager): void {
    this.form.controls['event_manager_id'].setValue(manager.value);
  }

  onSelectedHost(host): void {
    this.selectedManager = null;
    this.fetchManagersBySelectedStore(host.value);
    this.form.controls['store_id'].setValue(host.value);
  }

  fetchManagersBySelectedStore(storeId) {
    let search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeId);
    search.append('privilege_type', CP_PRIVILEGES_MAP.events.toString());

    this
      .adminService
      .getAdminByStoreId(search)
      .map(admins => {
        return [
          {
            'label': '---',
            'value': null
          },
          ...admins.map(admin => {
            return {
              'label': `${admin.firstname} ${admin.lastname}`,
              'value': admin.id
            }
          })
        ];
      }).subscribe(res => this.managers = res);
  }

  private fetch() {
    let school = this.session.g.get('school');
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    const event$ = this.eventService.getEventById(this.eventId);
    const stores$ = this.storeService.getStores(search);

    const stream$ = Observable.combineLatest(event$, stores$);

    super
      .fetchData(stream$)
      .then(res => {
        this.stores = res.data[1];
        this.event = res.data[0];
        this.buildForm(res.data[0]);
        this.selectedManager = this.event.attendance_manager_email ?
          { 'label': this.event.attendance_manager_email } : null;

        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data[0].latitude,
            lng: res.data[0].longitude
          }
        );
      })
      .catch(err => this.errorService.handleError(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'events_edit_event',
        'subheading': '',
        'children': []
      }
    });
  }

  getFromArray(arr: Array<any>, key: string, val: any) {
    return arr.filter(item => item[key] === val)[0];
  }

  enableStudentFeedbackOnAttendanceToggle(value) {
    this.form.controls['event_feedback'].setValue(value);
    this.originalAttnFeedback = this
      .getFromArray(this.booleanOptions, 'action', value);
  }

  toggleEventAttendance(value) {
    value = value ? 1 : 0;

    this.enableStudentFeedbackOnAttendanceToggle(value);

    this.form.controls['event_attendance'].setValue(value);
  }

  onResetMap() {
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields(this.school));
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    let cpMap = CPMap.getBaseMapObject(data);

    const location = {...cpMap, address: data.formatted_address}

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign(
      {},
      location,
      { location: location.name }
    )

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) { return; }

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);
      return;
    }

    let cpMap = CPMap.getBaseMapObject(data);

    const location = {...cpMap, address: data.name};

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({lat, lng});
  }

  onEventFeedbackChange(option) {
    this.form.controls['event_feedback'].setValue(option.action);
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('save'),
      class: 'primary'
    }

    this.dateFormat = FORMAT.DATETIME;
    this.booleanOptions = [
      {
        'label': this.cpI18n.translate('enabled'),
        'action': EventAttendance.enabled
      },
      {
        'label': this.cpI18n.translate('disabled'),
        'action': EventAttendance.disabled
      }
    ];
  }
}
