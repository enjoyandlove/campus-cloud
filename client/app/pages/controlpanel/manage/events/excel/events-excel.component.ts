import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { isDev } from '../../../../../config/env';
import { CPSession, ISchool } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CPDate, CP_PRIVILEGES_MAP } from '../../../../../shared/utils';
import { StoreService, AdminService } from '../../../../../shared/services';
import { EVENTS_MODAL_RESET } from '../../../../../reducers/events-modal.reducer';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';


@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() storeId: number;

  @Input() clubId: number;
  @Input() isClub: boolean;

  @Input() serviceId: number;
  @Input() isService: boolean;

  events;
  stores;
  errors = [];
  formError;
  mockDropdown;
  isChecked = [];
  school: ISchool;
  loading = false;
  form: FormGroup;
  isFormReady = false;
  buttonDropdownOptions;
  eventAttendanceFeedback;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private adminService: AdminService,
    private storeService: StoreService,
    private eventsService: EventsService
  ) {
    super();
    this.school = this.session.school;
    super.isLoading().subscribe(res => this.loading = res);

    this
      .store
      .select('EVENTS_MODAL')
      .subscribe(
      (res) => {
        this.events = !isDev ? res : require('./mock.json');
        this.fetch();
      });
  }

  private fetch() {
    let search: URLSearchParams = new URLSearchParams();
    search.append('school_id', this.school.id.toString());

    const stores$ = this.storeService.getStores(search).map(res => {
      const stores = [
        {
          'label': 'Host Name',
          'event': null
        }
      ];

      res.forEach(store => {
        stores.push({
          'label': store.name,
          'event': store.id
        });
      });
      return stores;
    });

    if (!this.storeId) {
      super
        .fetchData(stores$)
        .then(res => {
          this.buildForm();
          this.buildHeader();
          this.stores = res.data;
        })
        .catch(err => console.error(err));
    }
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Events from Excel',
        'em': `${this.events.length} calendar event(s) data information in the file`,
        'children': []
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'events': this.fb.array([])
    });
    this.buildGroup();

    if (this.isService) {
      this.updateManagersByStoreOrClubId(this.serviceId);
    }
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['events'];

    this.events.forEach((event, index) => {
      control.push(this.buildEventControl(event));
      this.isChecked.push({ index, checked: false });
    });

    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['events'];
    control.removeAt(index);
  }

  buildEventControl(event) {
    return this.fb.group({
      'store_id': [this.storeId || null, Validators.required],
      'room': [event.room, Validators.required],
      'title': [event.title, Validators.required],
      'poster_url': [null, Validators.required],
      'poster_thumb_url': [null, Validators.required],
      'location': [event.location, Validators.required],
      'managers': [[{ 'label': '---', 'event': null }]],
      'description': [event.description, Validators.required],
      'end': [CPDate.toEpoch(event.end_date), Validators.required],
      'start': [CPDate.toEpoch(event.start_date), Validators.required],
      // these controls are only required when event attendance is true
      'attendance_manager_email': [null],
      'event_manager_id': [null, Validators.required],
      'event_attendance': [1, Validators.required],
      'event_feedback': [this.eventAttendanceFeedback[0]],
    });
  }

  updateEventManager(manager, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_manager_id'].setValue(manager);
  }

  updateAttendanceFeedback(feedback, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_feedback'].setValue(feedback);
    control.controls['event_feedback'].value();
  }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['events'];

    this.isChecked.map(item => {

      if (item.checked) {
        let ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach(key => {
          ctrl.controls[key].setValue(actions[key]);
        });
      }

      return item;
    });
  }

  onSingleHostSelected(host, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];
    const managers$ = this.getManagersByHostId(host.event);

    managers$.subscribe(res => {
      control.controls['managers'].setValue(res);
    });

    control.controls['store_id'].setValue(host);
  }

  updateManagersByStoreOrClubId(storeId) {
    const events = <FormArray>this.form.controls['events'];
    const managers$ = this.getManagersByHostId(storeId);
    const groups = events.controls;

    managers$.subscribe(managers => {
      groups.forEach((group: FormGroup) => {
        group.controls['managers'].setValue(managers);
      });
    });
  }

  getManagersByHostId(storeId): Observable<any> {
    let search: URLSearchParams = new URLSearchParams();

    search.append('school_id', this.school.id.toString());
    search.append('store_id', storeId);
    search.append('privilege_type', CP_PRIVILEGES_MAP.events.toString());

    return this
    .adminService
    .getAdminByStoreId(search)
    .startWith([{'label': '---'}])
    .map(admins => {
      let _admins = [
        {
          'label': '---',
          'value': null
        }
      ];
      admins.forEach(admin => {
        _admins.push({
          'label': `${admin.firstname} ${admin.lastname}`,
          'value': admin.id
        });
      });
      return _admins;
    });
  }

  onSingleCheck(checked, index) {
    let _isChecked;

    _isChecked = this.isChecked.map(item => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }
      return item;
    });
    this.isChecked = [..._isChecked];
  }

  onCheckAll(checked) {
    let _isChecked = [];

    this.isChecked.map((item) => {
      _isChecked.push(Object.assign({}, item, { checked: checked }));
    });

    this.isChecked = [..._isChecked];
  }

  onHostBulkChange(store_id) {
    this.onBulkChange({ store_id });
  }

  onImageBulkChange(poster_url) {
    this.onBulkChange({ poster_url });
    this.onBulkChange({ poster_thumb_url: poster_url });
  }

  onSubmit() {
    this.errors = [];
    this.formError = false;

    let events = Object.assign({}, this.form.controls['events'].value);
    let _events = [];

    Object.keys(events).forEach(key => {
      let _event = {
        title: events[key].title,
        store_id: this.storeId ? this.storeId : events[key].store_id.event,
        description: events[key].description,
        end: events[key].end,
        room: events[key].room,
        start: events[key].start,
        location: events[key].location,
        poster_url: events[key].poster_url,
        poster_thumb_url: events[key].poster_thumb_url,
        event_attendance: events[key].event_attendance
      };

      if (events[key].event_attendance) {
        _event = Object.assign({}, _event, {
          event_feedback: events[key].event_feedback.event,
          event_manager_id: events[key].event_manager_id.value,
          attendance_manager_email: events[key].attendance_manager_email
        });
      }

      _events.push(_event);
    });

    this
      .eventsService
      .createEvent(_events)
      .subscribe(
      _ => this.router.navigate(['/manage/events']),
      err => {
        this.formError = true;

        if (err.status === 400) {
          this.errors.push('Invalid data');
          return;
        }

        this.errors.push('Something went wrong');
      }
      );
  }

  toggleSingleEventAttendance(checked, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    if (checked) {
      control.controls['event_manager_id'].setErrors({'required': true});
    } else {
      control.controls['event_manager_id'].reset();
    }

    control.controls['event_attendance'].setValue(checked);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: HEADER_DEFAULT });
    this.store.dispatch({ type: EVENTS_MODAL_RESET });
  }

  ngOnInit() {
    this.eventAttendanceFeedback = [
      {
        'label': 'Enabled',
        'event': 1
      },
      {
        'label': 'Disabled',
        'event': 0
      }
    ];
  }
}
