import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CPMap } from '../../../../../shared/utils';

declare var $: any;

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit {
  @Output() locationCreated: EventEmitter<any> = new EventEmitter();
  form: FormGroup;
  mapCenter;

  constructor(
    private fb: FormBuilder
  ) { }

  onPlaceChange(data) {
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

  doSubmit() {
    this.locationCreated.emit(this.form.value);
    $('#locationsCreate').modal('hide');
  }

  ngOnInit() {
    this.form = this.fb.group({
      'name': [null, Validators.required],
      'short_name': [null, Validators.required],
      'address': [null, Validators.required],
      'city': [null, Validators.required],
      'province': [null, Validators.required],
      'country': [null, Validators.required],
      'postal_code': [null, Validators.required],
      'latitude': [null, Validators.required],
      'longitude': [null, Validators.required],
    });
  }
}
