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
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields(this.school));
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    let cpMap = CPMap.getBaseMapObject(data);

    const location = {...cpMap, address: data.formatted_address}

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign(
      {},
      location,
      { location: location.name }
    )

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) { return; }

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);
      return;
    }

    let cpMap = CPMap.getBaseMapObject(data);

    const location = {...cpMap, address: data.name};

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({lat, lng});
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
