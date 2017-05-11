import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

// import { ClubsService } from '../clubs.service';
import { CPMap } from '../../../../../shared/utils';
import { membershipTypes, statusTypes } from './permissions';

@Component({
  selector: 'cp-clubs-create',
  templateUrl: './clubs-create.component.html',
  styleUrls: ['./clubs-create.component.scss']
})
export class ClubsCreateComponent implements OnInit {
  formError;
  statusTypes;
  membershipTypes;
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private errorService: ErrorService,
    // private clubsService: ClubsService,
  ) { }

  onPlaceChange(address) {
    let cpMap = CPMap.getBaseMapObject(address);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(`${cpMap.street_number} ${cpMap.street_name}`);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);
  }

  buildAdminControl() {
    return this.fb.group({
      'first_name': [null, Validators.required],
      'last_name': [null, Validators.required],
      'email': [null, Validators.required]
    });
  }

  removeAdminControl(index): void {
    let control = <FormArray>this.form.controls['admins'];
    control.removeAt(index);
  }

  addAdminControl(): void {
    let control = <FormArray>this.form.controls['admins'];
    control.push(this.buildAdminControl());
  }

  onSubmit() {
    if (!this.form.valid) {
      this.formError = true;
      return;
    }
  }

  onSelectedMembership(type) {
    console.log(type);
  }

  onSelectedStatus(type) {
    console.log(type);
  }

  ngOnInit() {
    this.statusTypes = statusTypes;
    this.membershipTypes = membershipTypes;

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'logo_url': [null, Validators.required],
      'status': [null, Validators.required],
      'membership': [null, Validators.required],
      'location': [null],
      'address': [null],
      'city': [null],
      'country': [null],
      'postal_code': [null],
      'province': [null],
      'latitude': [null],
      'longitude': [null],
      'room': [null],
      'room_data': [null],
      'description': [null],
      'website': [null],
      'phone_number': [null, Validators.required],
      'email': [null, Validators.required],
      'admins': this.fb.array([this.buildAdminControl()]),
    });
  }
}
