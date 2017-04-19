import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { isProd } from '../../../../../config/env';
import { CPDate } from '../../../../../shared/utils';
import { StoreService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';


@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  events;
  stores;
  errors = [];
  formError;
  mockDropdown;
  eventManagers;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  buttonDropdownOptions;
  eventAttendanceFeedback;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private storeService: StoreService,
    private eventsService: EventsService
  ) {
    super();
    this
      .store
      .select('EVENTS_MODAL')
      .subscribe(
      (res) => {
        this.events = isProd ? res : require('./mock.json');
        this.fetch();
      },
      err => console.log(err)
      );
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    const stores$ = this.storeService.getStores().map(res => {
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

    super
      .fetchData(stores$)
      .then(res => {
        this.buildForm();
        this.buildHeader();
        this.stores = res.data;
      })
      .catch(err => console.error(err));
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
      'store_id': [null, Validators.required],
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
      'event_manager_id': [null],
      'event_attendance': [1, Validators.required],
      'event_feedback': [this.eventAttendanceFeedback[1]],
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
  }

  // onBulkDelete() {
  //   let _isChecked = [];

  //   this.isChecked.reverse().forEach(item => {
  //     if (item.checked) {
  //       this.isChecked.slice(item.index, 1);
  //       this.removeControl(item.index);
  //       return;
  //     }
  //     item = Object.assign({}, item, { index: _isChecked.length });
  //     _isChecked.push(item);
  //   });

  //   this.isChecked = [ ..._isChecked ];
  // }

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

    control.controls['store_id'].setValue(host);
    control.controls['managers'].setValue(this.getManagersByHostId(host.event));
  }

  getManagersByHostId(hostId) {
    let _managers = [
      {
        'label': '---',
        'event': null
      }
    ];

    this.eventManagers.filter(manager => {
      if (manager.host_id === hostId) {
        _managers.push(manager);
      }
    });

    return _managers;
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
        store_id: events[key].store_id.event,
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
          event_manager_id: events[key].event_manager_id.event,
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

    control.controls['event_attendance'].setValue(checked);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: HEADER_DEFAULT });
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

    this.eventManagers = [
      {
        'host_id': 28819,
        'label': 'Dummy',
        'event': 16776
      },
      {
        'host_id': 28819,
        'label': 'Dummy',
        'event': 16776
      },
      {
        'host_id': 28819,
        'label': 'Dummy',
        'event': 16776
      },
      {
        'host_id': 2756,
        'label': 'Hello',
        'event': 16776
      }
    ];
  }
}
