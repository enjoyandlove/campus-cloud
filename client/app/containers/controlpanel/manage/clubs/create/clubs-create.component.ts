import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { ClubStatus } from '../club.status';
import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { membershipTypes, statusTypes } from './permissions';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-clubs-create',
  templateUrl: './clubs-create.component.html',
  styleUrls: ['./clubs-create.component.scss']
})
export class ClubsCreateComponent implements OnInit {
  school;
  formError;
  buttonData;
  form: FormGroup;
  statusTypes = statusTypes;
  mapCenter: BehaviorSubject<any>;
  membershipTypes = membershipTypes;
  newAddress = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private clubsService: ClubsService,
  ) { }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
      return;
    }

    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id.toString());

    this
      .clubsService
      .createClub(this.form.value, search)
      .subscribe(
        res => {this.router.navigate(['/manage/clubs/' + res.id + '/info']); },
        err => {
          this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
          throw new Error(err);
         }
      );
  }

  onUploadedImage(image): void {
    this.form.controls['logo_url'].setValue(image);
  }

  onSelectedMembership(type): void {
    this.form.controls['has_membership'].setValue(type.action);
  }

  onSelectedStatus(type): void {
    this.form.controls['status'].setValue(type.action);
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

    this.newAddress.next(this.form.controls['address'].value);
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

  ngOnInit() {
    this.school = this.session.g.get('school');

    this.mapCenter = new BehaviorSubject(
      {
        lat: this.school.latitude,
        lng: this.school.longitude
      });

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload:
      {
        'heading': 'clubs_button_create',
        'subheading': null,
        'em': null,
        'children': []
      }
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('clubs_button_create')
    };

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'logo_url': [null, Validators.required],
      'status': [ClubStatus.active, Validators.required],
      'has_membership': [true, Validators.required],
      'location': [null],
      'address': [null],
      'city': [null],
      'country': [null],
      'postal_code': [null],
      'province': [null],
      'latitude': [this.session.g.get('school').latitude],
      'longitude': [this.session.g.get('school').longitude],
      'room_info': [null],
      'description': [null],
      'website': [null],
      'phone': [null],
      'email': [null],
    });
  }
}
