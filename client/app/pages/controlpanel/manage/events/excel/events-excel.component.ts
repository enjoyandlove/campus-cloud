import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cp-events-excel',
  templateUrl: './events-excel.component.html',
  styleUrls: ['./events-excel.component.scss']
})
export class EventsExcelComponent implements OnInit {
  events;
  mockDropdown;
  form: FormGroup;
  isFormReady = false;

  constructor(
    private fb: FormBuilder
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
    this.events = require('./mock.json');
    this.buildForm();
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
      'event_attendnace': [true, Validators.required],
      'event_attendnace_feedback': [true, Validators.required],
      'event_poster': ['default', Validators.required],
    });
  }


  ngOnInit() { }
}
