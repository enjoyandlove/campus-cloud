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
    });
  }

  addLinkControl() {
    console.log(this.form.controls['links']);
    const control = <FormArray>this.form.controls['links'];
    control.push(this.createLinkControl());
  }

  removeService(index) {
    const control = <FormArray>this.form.controls['links'];
    control.removeAt(index);
  }

  onDeleteControl(index) {
    this.removeService(index);
    console.log(index);
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
    console.log('submitting');
  }

  ngOnInit() { }
}
