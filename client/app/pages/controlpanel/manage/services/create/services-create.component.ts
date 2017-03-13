import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {
  form: FormGroup;
  formError = false;
  attendance = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>
  ) {
    this.buildHeader();
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
        'heading': 'Create Service',
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

  ngOnInit() {

  }
}
