import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  IHeader,
  HEADER_UPDATE
} from '../../../../../reducers/header.reducer';
// import { EventsService } from '../events.service';

@Component({
  selector: 'cp-events-facebook',
  templateUrl: './events-facebook.component.html',
  styleUrls: ['./events-facebook.component.scss']
})
export class EventsFacebookComponent implements OnInit {
  isAttendance;
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    // private service: EventsService
  ) {
    this.buildHeader();

    this.form = this.fb.group({
      'links': this.fb.array([
        this.createLinkControl()
      ])
    });
  }

  createLinkControl() {
    return this.fb.group({
      'link': ['', Validators.required],
      'store_id': ['', Validators.required],
      'feedback': [false, Validators.required],
      'attendance': [false, Validators.required],
      'event_manager': ['', Validators.required],
      'attendance_manager': [''],
    });
  }

  addLinkControl() {
    const control = <FormArray>this.form.controls['links'];
    control.push(this.createLinkControl());
  }

  removeService(index) {
    const control = <FormArray>this.form.controls['links'];
    control.removeAt(index);
  }

  onDeleteControl(index) {
    this.removeService(index);
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Facebook Events',
        'subheading': '',
        'children': []
      }
    });
  }

  doSubmit() {
    console.log(this.form.value);
  }

  toogleFeedback(index, status) {
    const control = <FormArray>this.form.controls['links'];
    const group = <FormGroup>control.controls[index];

    group.controls['feedback'].setValue(status);
  }

  toggleIsAttendance(index, status) {
    const control = <FormArray>this.form.controls['links'];
    const group = <FormGroup>control.controls[index];

    group.controls['attendance'].setValue(status);
  }

  ngOnInit() { }
}
