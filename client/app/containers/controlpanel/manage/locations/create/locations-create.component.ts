import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  form: FormGroup;
  school: ISchool;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private fb: FormBuilder,
    private session: CPSession
  ) { }

  onResetMap() {
    this.form.controls['city'].setValue('');
    this.form.controls['province'].setValue('');
    this.form.controls['country'].setValue('');
    this.form.controls['latitude'].setValue(this.school.latitude);
    this.form.controls['longitude'].setValue(this.school.longitude);
    this.form.controls['address'].setValue('');
    this.form.controls['postal_code'].setValue('');

    this.mapCenter.next({
      lat: this.school.latitude,
      lng: this.school.longitude
    });
  }

  onMapSelection(data) {
    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(data.formatted_address);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);
  }

  onPlaceChange(data) {
    if (!data) { return; }

    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(data.name);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter.next(data.geometry.location.toJSON());
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
    this.school = this.session.g.get('school');
    this.mapCenter = new BehaviorSubject(
      {
        lat: this.school.latitude,
        lng: this.school.longitude
      }
    );

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
