import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  ErrorService,
  StoreService,
  AdminService,
  CPI18nService } from '../../../../../shared/services';

import { EventsService } from '../events.service';
import { CPSession, ISchool } from '../../../../../session';
import { CPMap, CPDate } from '../../../../../shared/utils';
import { EventAttendance, EventFeedback } from '../event.status';
import { CP_PRIVILEGES_MAP } from './../../../../../shared/constants';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

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
  @Input() clubId: boolean;
  @Input() serviceId: number;
  @Input() isService: boolean;

  stores$;
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
  managers: Array<any> = [{'label': '---'}];
  mapCenter: BehaviorSubject<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    private storeHeader: Store<any>,
    private adminService: AdminService,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    this.school = this.session.g.get('school');
    let search: URLSearchParams = new URLSearchParams();

    this.buildHeader();
    search.append('school_id', this.school.id.toString());

    this.stores$ = this.storeService.getStores(search);
  }

  buildHeader() {
    const payload = {
      'heading': 'events_create_heading',
      'subheading': null,
      'em': null,
      'children': []
    }

    this.storeHeader.dispatch({
      type: HEADER_UPDATE,
      payload
    });
  }

  onSelectedManager(manager): void {
    this.form.controls['event_manager_id'].setValue(manager.value);
  }

  onSelectedHost(host): void {
    this.fetchManagersBySelectedStore(host.value);

    this.form.controls['store_id'].setValue(host.value);
  }

  fetchManagersBySelectedStore(storeId) {
    const search: URLSearchParams = new URLSearchParams();

    search.append('store_id', storeId);
    search.append('school_id', this.school.id.toString());
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
    }).subscribe(
      managers => this.managers = managers,
      err => { throw new Error(err) }
    );
  }

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);
  }

  toggleEventAttendance(value) {
    value = value ? 1 : 0;

    this.form.controls['event_attendance'].setValue(value);
  }

  onPlaceChange(data) {
    if (!data) { return; }

    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(data.name);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter.next(data.geometry.location.toJSON());
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
      let managerId = this.form.controls['event_manager_id'];
      let eventFeedback = this.form.controls['event_feedback'];

      if (!(managerId.value)) {
        this.formError = true;
        managerId.setErrors({'required': true});
        this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      }

      if (!(eventFeedback.value)) {
        this.formError = true;
        eventFeedback.setErrors({'required': true});
        this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      }
    }

    if (this.form.controls['end'].value <= this.form.controls['start'].value) {
      this.isDateError = true;
      this.formError = true;
      this.form.controls['end'].setErrors({ 'required': true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_before_start');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      return;
    }

    if (this.form.controls['end'].value <= Math.round(new Date().getTime() / 1000)) {
      this.isDateError = true;
      this.formError = true;
      this.form.controls['end'].setErrors({ 'required': true });
      this.dateErrorMessage = this.cpI18n.translate('events_error_end_date_after_now');
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      return;
    }

    this
      .eventService
      .createEvent(this.form.value)
      .subscribe(
      res => {
        if (this.isService) {
          this.router.navigate([`/manage/services/${this.serviceId}/events/${res.id}`]);
          return;
        }
        if (this.isClub) {
          this.router.navigate([`/manage/clubs/${this.clubId}/events/${res.id}`]);
          return;
        }
        this.router.navigate(['/manage/events/' + res.id]);
      },
      err => {
        this.errorService.handleError(err);
        this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      }
      );
  }

  onEventFeedbackChange(option) {
    this.form.controls['event_feedback'].setValue(option.action);
  }

  ngOnInit() {
    let store_id;
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

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('events_button_new')
    }

    this.booleanOptions = [
      {
        'label': this.cpI18n.translate('enabled'),
        'action': EventFeedback.enabled
      },
      {
        'label': this.cpI18n.translate('disabled'),
        'action': EventFeedback.disabled
      }
    ];

    this.mapCenter = new BehaviorSubject(
      {
        lat: this.school.latitude,
        lng: this.school.longitude
      });

    this.form = this.fb.group({
      'title': [null, Validators.required],
      'store_id': [store_id ? store_id : null, Validators.required],
      'location': [null],
      'room_data': [null],
      'city': [null],
      'province': [null],
      'country': [null],
      'address': [null],
      'postal_code': [null],
      'latitude': [this.school.latitude],
      'longitude': [this.school.longitude],
      'event_attendance': [EventAttendance.disabled],
      'start': [null, Validators.required],
      'poster_url': [null, Validators.required],
      'poster_thumb_url': [null, Validators.required],
      'end': [null, Validators.required],
      'description': [null],
      'event_feedback': [EventFeedback.enabled],
      'event_manager_id': [null],
      'attendance_manager_email': [null],
      'custom_basic_feedback_label': [null]
    });

    let _self = this;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onClose: function (date) {
        _self.form.controls['start'].setValue(CPDate.toEpoch(date[0]));
      }
    };

    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onClose: function (date) {
        _self.form.controls['end'].setValue(CPDate.toEpoch(date[0]));
      }
    };
  }
}
