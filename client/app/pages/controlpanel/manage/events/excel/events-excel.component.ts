import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

// import { EventsService } from '../events.service';
import { StoreService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';
import { CPDate } from '../../../../../shared/utils/date';
import { EVENTS_MODAL_RESET } from '../../../../../reducers/events-modal.reducer';


@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  events;
  stores;
  mockDropdown;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  buttonDropdownOptions;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private storeService: StoreService
    // private service: EventsService
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
        this.stores = res;
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
      'event_poster': ['default', Validators.required],
      'location': [event.location, Validators.required],
      'description': [event.description, Validators.required],
      'end': [CPDate.toEpoch(event.end_date), Validators.required],
      'start': [CPDate.toEpoch(event.start_date), Validators.required],
      // these controls are only required when event attendance is true
      'event_manager': [null],
      'attendance_manager': [null],
      'event_attendance_feedback': [1],
      'event_attendance': [true, Validators.required],
    });
  }

  onBulkDelete() {
    let _isChecked = [];

    this.isChecked.reverse().forEach(item => {
      if (item.checked) {
        this.isChecked.slice(item.index, 1);
        this.removeControl(item.index);
        return;
      }
      item = Object.assign({}, item, { index: _isChecked.length });
      _isChecked.push(item);
    });

    this.isChecked = [ ..._isChecked ];
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
    console.log(actions);
  }

  onSingleHostSelected(host, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['store_id'].setValue(host.action);
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

  onImageBulkChange(image) {
    console.log(image);
  }

  onSubmit() {
    console.log(this.form.value);
    console.log(this.form.valid);
    // console.log(this.form.value);
  }

  toggleSingleEventAttendance(checked, index) {
    const controls = <FormArray>this.form.controls['events'];
    const control = <FormGroup>controls.controls[index];

    control.controls['event_attendance'].setValue(checked);
  }

  ngOnDestroy() {
    this.store.dispatch({ type: HEADER_DEFAULT });
    this.store.dispatch({ type: EVENTS_MODAL_RESET });
  }

  ngOnInit() { }
}
