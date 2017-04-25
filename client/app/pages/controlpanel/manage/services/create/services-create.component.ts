import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {
  mapCenter;
  form: FormGroup;
  categories = [{ label: '---', action: null }];
  formError = false;
  attendance = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>
  ) {
    this.buildHeader();
    this.form = this.fb.group({
      'name': [null, Validators.required],
      'logo_url': [null, Validators.required],
      'category': [null, Validators.required],
      'store_id': [null, Validators.required],
      'location': [null],
      'room_data': [null],
      'address': [null],
      'description': [null],
      'email': [null],
      'website': [null],
      'phone': [null],
      'secondary_name': [null],
      'city': [null],
      'province': [null],
      'country': [null],
      'postal_code': [null],
      'latitude': [null],
      'longitude': [null],
      'service_attendance': [null],
      'rating_scale_maximum': [null],
      'default_basic_feedback_label': [null]
    });
  }

  onPlaceChanged(data) {
    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(`${cpMap.street_number} ${cpMap.street_name}`);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter = data.geometry.location.toJSON();
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
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }
  }

  onDelete() {

  }

  ngOnInit() {
    let categories = require('../categories.json');

    categories.map(category => {
      this.categories.push({
        label: category.name,
        action: category.id
      });
    });
  }
}
