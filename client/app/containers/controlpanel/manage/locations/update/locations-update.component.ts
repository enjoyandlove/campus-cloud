import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';

declare var $: any;

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss'],
})
export class LocationsUpdateComponent implements OnInit {
  @Input() location: any;
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() locationUpdated: EventEmitter<any> = new EventEmitter();

  school;
  form: FormGroup;
  isFormReady = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  constructor(private fb: FormBuilder, private session: CPSession) {}

  doSubmit() {
    $('#locationsUpdate').modal('hide');
    this.locationUpdated.emit({
      id: this.location.id,
      data: this.form.value,
    });
    this.resetModal();
  }

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
      lng: this.school.longitude,
    });
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(data.formatted_address);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);
    this.newAddress.next(this.form.controls['address'].value);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(data.name);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter.next(data.geometry.location.toJSON());
  }

  resetModal() {
    this.teardown.emit();
  }

  ngOnInit() {
    this.school = this.session.g.get('school');

    this.mapCenter = new BehaviorSubject({
      lat: this.location.latitude,
      lng: this.location.longitude,
    });

    this.form = this.fb.group({
      name: [this.location.name, Validators.required],
      short_name: [this.location.short_name, Validators.required],
      address: [this.location.address, Validators.required],
      city: [this.location.city, Validators.required],
      province: [this.location.province, Validators.required],
      country: [this.location.country, Validators.required],
      postal_code: [this.location.postal_code, Validators.required],
      latitude: [this.location.latitude, Validators.required],
      longitude: [this.location.longitude, Validators.required],
    });

    this.isFormReady = true;
  }
}
