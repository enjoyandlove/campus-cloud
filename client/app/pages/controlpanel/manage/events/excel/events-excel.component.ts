import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

// import { EventsService } from '../events.service';
import { EVENTS_MODAL_RESET } from '../../../../../reducers/events-modal.reducer';

@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent implements OnInit, OnDestroy {
  events;
  mockDropdown;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    // private service: EventsService
  ) {
    this.fetch();
    this.mockDropdown = [
      {
        'label': 'Lorem',
        'action': 'lorem'
      },
      {
        'label': 'Lorem',
        'action': 'lorem'
      }
    ];
  }

  private fetch() {
    this
      .store
      .select('EVENTS_MODAL')
      .subscribe(
        res => {
          this.events = res;
          console.log(res);

          if (this.events.length) {
            this.buildForm();
          }
        },
        err => {
          console.log(err);
        }
    );
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

  ngOnInit() {
    // this.store.select('EVENTS_MODAL').subscribe(res => console.log(res));
    // console.log(this.service.getModalEvents());
  }
}
