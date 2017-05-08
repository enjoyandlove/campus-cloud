import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { CPMap } from '../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../session';

declare var $: any;

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() locationCreated: EventEmitter<any> = new EventEmitter();

  mapCenter;
  form: FormGroup;
  school: ISchool;

  constructor(
    private fb: FormBuilder,
    private session: CPSession
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
    this.resetModal();
  }

  resetModal() {
    this.teardown.emit();
  }

  ngOnInit() {
    this.school = this.session.school;

    this.mapCenter = { lat: this.school.latitude, lng: this.school.longitude };

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'short_name': [null, Validators.required],
      'address': [null, Validators.required],
      'city': [null, Validators.required],
      'province': [null, Validators.required],
      'country': [null, Validators.required],
      'postal_code': [null, Validators.required],
      'latitude': [this.school.latitude, Validators.required],
      'longitude': [this.school.longitude, Validators.required],
    });
  }
}
