import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { StoreService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';
import { CPDate } from '../../../../../shared/utils/date';


@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  events;
  stores;
  mockDropdown;
  eventManagers;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  buttonDropdownOptions;
  eventAttendanceFeedback;

  constructor(
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
        (_) => {
          // this.events = res;
          this.events = require('./mock.json');
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
          'action': null
        }
      ];

      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
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
      'store_id': ['', Validators.required],
      'room': [event.room, Validators.required],
      'title': [event.title, Validators.required],
      'poster_url': [null, Validators.required],
      'poster_thumb_url': [null, Validators.required],
      'location': [event.location, Validators.required],
      'description': [event.description, Validators.required],
      'end': [CPDate.toEpoch(event.end_date), Validators.required],
      'start': [CPDate.toEpoch(event.start_date), Validators.required],
      // these controls are only required when event attendance is true
      'attendance_manager_email': [null],
      'event_manager_id': [this.eventManagers[0]],
      'event_attendance': [true, Validators.required],
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
    console.log(actions);
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
    let events = Object.assign({}, this.form.controls['events'].value);
    let _events = [];

    Object.keys(events).forEach(key => {
      _events.push({
        attendance_manager_email: events[key].attendance_manager_email,
        description: events[key].description,
        end: events[key].end,
        event_attendance: events[key].event_attendance,
        event_feedback: events[key].event_feedback.event,
        event_manager_id: events[key].event_manager_id.event,
        location: events[key].location,
        poster_thumb_url: events[key].poster_thumb_url,
        poster_url: events[key].poster_url,
        room: events[key].room,
        start: events[key].start,
        store_id: events[key].store_id.action,
        title: events[key].title
      });
    });

    this
      .eventsService
      .createEvent(_events)
      .subscribe(
        res => console.log(res),
        err => console.log(err)
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
        'label': 'Dummy',
        'event': 16776
      },
      {
        'label': 'Hello',
        'event': 16776
      }
    ];
  }
}
