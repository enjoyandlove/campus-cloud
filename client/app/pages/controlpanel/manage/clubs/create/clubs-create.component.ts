import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

// import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { membershipTypes, statusTypes } from './permissions';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

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
  mapCenter: BehaviorSubject<any>;

  constructor(
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession
    // private errorService: ErrorService,
    // private clubsService: ClubsService,
  ) { }

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

  onPlaceChange(data) {
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

  ngOnInit() {
    let school = this.session.school;

    this.mapCenter = new BehaviorSubject(
      {
        lat: school.latitude,
        lng: school.longitude
      });

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload:
      {
        'heading': 'Create Club',
        'subheading': null,
        'em': null,
        'children': []
      }
    });

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
