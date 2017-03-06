import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent implements OnInit {
  form: FormGroup;
  formError = false;
  attendance = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>
  ) {
    this.buildForm();
    this.buildHeader();
  }

  buildForm() {
    this.form = this.fb.group({
      'title': ['', Validators.required],
      'store_id': ['', Validators.required],
      'location': ['', Validators.required],
      'room_data': ['', Validators.required],
      'address': ['', Validators.required],
      'start': ['', Validators.required],
      'end': ['', Validators.required],
      'description': ['', Validators.required],
      'attend_verification_methods': ['']
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Edit Service',
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  onSubmit() {
    console.log(this.form.value);
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }
  }

  onDelete() {
    console.log('hello');
  }

  ngOnInit() { }
}
