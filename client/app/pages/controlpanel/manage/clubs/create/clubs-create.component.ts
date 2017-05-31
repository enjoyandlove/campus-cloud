import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
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
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private clubsService: ClubsService,
  ) { }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }

    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    this
      .clubsService
      .createClub(this.form.value, search)
      .subscribe(
        res => {this.router.navigate(['/manage/clubs/' + res.id + '/info']); },
        err => console.log(err)
      );
  }

  onUploadedImage(image): void {
    this.form.controls['logo_url'].setValue(image);
  }

  onSelectedMembership(type) {
    this.form.controls['has_membership'].setValue(type.action);
  }

  onSelectedStatus(type) {
    this.form.controls['status'].setValue(type.action);
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
      'status': [1, Validators.required],
      'has_membership': [true, Validators.required],
      'location': [null],
      'address': [null],
      'city': [null],
      'country': [null],
      'postal_code': [null],
      'province': [null],
      'latitude': [null],
      'longitude': [null],
      'room_info': [null],
      'description': [null],
      'website': [null],
      'phone': [null],
      'email': [null],
    });
  }
}
