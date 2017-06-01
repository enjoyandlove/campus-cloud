import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { ClubsService } from '../clubs.service';
import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base/base.component';
import { membershipTypes, statusTypes } from '../create/permissions';
import { HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-clubs-edit',
  templateUrl: './clubs-edit.component.html',
  styleUrls: ['./clubs-edit.component.scss']
})
export class ClubsEditComponent extends BaseComponent implements OnInit {
  club;
  clubId;
  loading;
  formError;
  statusTypes;
  membershipTypes;
  form: FormGroup;
  isFormReady = false;
  defaultStatus;
  defaultMembership;
  mapCenter: BehaviorSubject<any>;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private route: ActivatedRoute,
    private clubsService: ClubsService,
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.clubId = this.route.snapshot.params['clubId'];
  }

  getDefaultStatus(value) {
    let result;

    this.statusTypes.map(status => {
      if (status.action === value) {
        result = status;
      }
    });

    return result;
  }

  getDefaultMembership(value) {
    let result;

    this.membershipTypes.map(membership => {
      if (membership.action === value) {
        result = membership;
      }
    });

    return result;
  }

  fetch() {
    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    const stream$ = this.clubsService.getClubById(this.clubId, search);

    super
      .fetchData(stream$)
      .then(res => {
        this.club = res.data;
        this.buildForm();

        this.defaultStatus = this.getDefaultStatus(this.club.status);
        this.defaultMembership = this.getDefaultMembership(this.club.has_membership);

        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data.latitude,
            lng: res.data.longitude
          }
        );
      })
      .catch(err => console.log(err));
  }

  buildForm() {
    this.form = this.fb.group({
      'name': [this.club.name, Validators.required],
      'logo_url': [this.club.logo_url, Validators.required],
      'status': [this.club.status, Validators.required],
      'has_membership': [this.club.has_membership, Validators.required],
      'location': [this.club.location],
      'address': [this.club.address],
      'city': [this.club.city],
      'country': [this.club.country],
      'postal_code': [this.club.postal_code],
      'province': [this.club.province],
      'latitude': [this.club.latitude],
      'longitude': [this.club.longitude],
      'room_info': [this.club.room_info],
      'description': [this.club.description],
      'website': [this.club.website],
      'phone': [this.club.phone],
      'email': [this.club.email],
    });

    this.isFormReady = true;
  }

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
      .updateClub(this.form.value, this.clubId, search)
      .subscribe(
      res => { this.router.navigate(['/manage/clubs/' + res.id + '/info']); },
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
    this.fetch();
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload:
      {
        'heading': 'Edit Club',
        'subheading': null,
        'em': null,
        'children': []
      }
    });

    this.statusTypes = statusTypes;
    this.membershipTypes = membershipTypes;
  }
}
