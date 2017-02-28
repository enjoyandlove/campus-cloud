import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

// import { EventsService } from '../events.service';
import { StoreService } from '../../../../../shared/services';
import { BaseComponent }  from '../../../../../base/base.component';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { EVENTS_MODAL_RESET } from '../../../../../reducers/events-modal.reducer';
// import { BUTTON_ALIGN, BUTTON_THEME } from '../../../../../shared/components/cp-button-dropdown';

@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  events;
  stores;
  mockDropdown;
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
    this.fetch();
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
          this.events = require('./mock.json');
          this.stores = res;
          this.buildForm();
          this.buildHeader();
        })
        .catch(err => console.error(err));

    // this
    //   .store
    //   .select('EVENTS_MODAL')
    //   .subscribe(
    //     res => {
    //       this.events = res;
    //       console.log(res);

    //       if (this.events.length) {
    //         this.buildForm();
    //       }
    //     },
    //     err => {
    //       console.log(err);
    //     }
    // );
  }

  onBulkAction(action) {
    console.log(action);
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Events from Excel',
        'subheading': `${this.events.length} calendar event(s) data information in the file`,
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

    this.events.map(event => {
      control.push(this.buildEventControl(event));
    });
    this.isFormReady = true;
  }

  buildEventControl(event) {
    return this.fb.group({
      'title': [event.title, Validators.required],
      'description': [event.description, Validators.required],
      'store_id': ['', Validators.required],
      'event_manager': ['', Validators.required],
      'attendance_manager': [''],
      'start': [event.start_date, Validators.required],
      'end': [event.end_date, Validators.required],
      'location': [event.location, Validators.required],
      'room': [event.room, Validators.required],
      'event_attendance': [true, Validators.required],
      'event_attendance_feedback': [true, Validators.required],
      'event_poster': ['default', Validators.required],
    });
  }

  ngOnDestroy() {
    this.store.dispatch({ type: EVENTS_MODAL_RESET });
  }

  onSubmit() {
    console.log(this.form.value);
  }

  ngOnInit() {

    // this.store.select('EVENTS_MODAL').subscribe(res => console.log(res));
    // console.log(this.service.getModalEvents());
  }
}
