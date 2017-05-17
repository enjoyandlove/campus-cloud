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
import { STATUS } from '../../../../../shared/constants';
import { CPSession, ISchool } from '../../../../../session';
import { FORMAT } from '../../../../../shared/pipes/date.pipe';
import { BaseComponent } from '../../../../../base/base.component';
import { CPMap, CPDate, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { ErrorService, StoreService, AdminService } from '../../../../../shared/services';

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
  @Input() isService: boolean;

  event;
  stores;
  dateFormat;
  serverError;
  originalHost;
  booleanOptions;
  loading = true;
  school: ISchool;
  eventId: number;
  form: FormGroup;
  selectedManager;
  STATUS = STATUS;
  enddatePickerOpts;
  attendance = false;
  isFormReady = false;
  startdatePickerOpts;
  originalAttnFeedback;
  formMissingFields = false;
  mapCenter: BehaviorSubject<any>;
  managers: Array<any> = [{'label': '---'}];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private storeService: StoreService,
    private errorService: ErrorService,
    private eventService: EventsService
  ) {
    super();
    this.school = this.session.school;
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
    console.log(this.form.value);
    this.formMissingFields = false;

    if (this.form.controls['event_attendance'].value === 1) {
      let managerId = this.form.controls['event_manager_id'];
      let eventFeedback = this.form.controls['event_feedback'];

      if (managerId.value === null) {
        this.formMissingFields = true;
        managerId.setErrors({'required': true});
      }

      if (eventFeedback.value === null) {
        this.formMissingFields = true;
        eventFeedback.setErrors({'required': true});
      }
    }

    if (!this.form.valid) {
      if (!this.form.controls['poster_url'].valid) {
        this.form.controls['poster_url'].setErrors({ 'required': true });
      }
      this.formMissingFields = true;
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
          this.router.navigate([`/manage/clubs/${this.storeId}/events/${this.eventId}`]);
          return;
        }
        this.router.navigate(['/manage/events/' + this.eventId]);
      },
      _ => this.serverError = true
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
      'attendance_manager_email': [res.attendance_manager_email]
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
        let _admins = [
          {
            'label': '---',
            'value': null,
          }
        ];
        admins.forEach(admin => {
          if (admin.id === this.form.controls['event_manager_id'].value) {
            this.selectedManager = {
              'label': `${admin.firstname} ${admin.lastname}`,
              'value': admin.id
            };
          }
          _admins.push({
            'label': `${admin.firstname} ${admin.lastname}`,
            'value': admin.id
          });
        });
        return _admins;
      }).subscribe(res => this.managers = res);
  }

  private fetch() {
    let school = this.session.school;
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', school.id.toString());

    const event$ = this.eventService.getEventById(this.eventId);
    const stores$ = this
      .storeService
      .getStores(search)
      .startWith([{ 'label': '---' }])
      .map(res => {
        const stores = [
          {
            'label': 'All Hosts',
            'value': null
          }
        ];
        res.forEach(store => {
          stores.push({
            'label': store.name,
            'value': store.id
          });
        });
        return stores;
      });

    const stream$ = Observable.combineLatest(event$, stores$);

    super
      .fetchData(stream$)
      .then(res => {
        this.stores = res.data[1];
        this.event = res.data[0];
        this.buildForm(res.data[0]);
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
        'heading': 'Edit Event',
        'subheading': '',
        'children': []
      }
    });
  }

  getFromArray(arr: Array<any>, key: string, val: any) {
    let result;

    arr.forEach(item => {
      if (item[key] === val) {
        result = item;
      }
    });

    return result;
  }

  toggleEventAttendance(value) {
    value = value ? 1 : 0;

    this.form.controls['event_attendance'].setValue(value);
  }

  onPlaceChange(data) {
    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(data.formatted_address);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter.next(data.geometry.location.toJSON());
  }

  onEventFeedbackChange(option) {
    this.form.controls['event_feedback'].setValue(option.value);
  }

  ngOnInit() {
    // services || clubs we need to fetch admins
    if (this.storeId) {
      this.fetchManagersBySelectedStore(this.storeId);
    }

    this.dateFormat = FORMAT.DATETIME;
    this.booleanOptions = [
      {
        'label': 'Enabled',
        'action': 1
      },
      {
        'label': 'Disabled',
        'action': 0
      }
    ];
  }
}
