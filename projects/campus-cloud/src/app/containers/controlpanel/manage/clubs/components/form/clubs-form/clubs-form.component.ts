import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CPSession, ISchool } from '@campus-cloud/session';
import { CPTrackingService } from '@campus-cloud/shared/services';
import { CPMap, canSchoolReadResource } from '@campus-cloud/shared/utils';
import { ClubsUtilsService } from '@controlpanel/manage/clubs/clubs.utils.service';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { isClubAthletic, clubAthleticLabels } from '../../../clubs.athletics.labels';

@Component({
  selector: 'cp-clubs-form',
  templateUrl: './clubs-form.component.html',
  styleUrls: ['./clubs-form.component.scss']
})
export class ClubsFormComponent implements OnInit {
  @Input() club;
  @Input() isEdit;
  @Input() formError;
  @Input() form: FormGroup;
  @Input() limitedAdmin = false;
  @Input() isAthletic = isClubAthletic.club;

  labels;
  selectedStatus;
  school: ISchool;
  selectedMembership;
  hasMemberShip = false;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);
  statusTypes = this.utils.getStatusTypes();
  membershipTypes = this.utils.getMembershipTypes();

  constructor(
    private session: CPSession,
    private utils: ClubsUtilsService,
    private cpTracking: CPTrackingService
  ) {}

  onUploadedImage(image): void {
    this.form.get('logo_url').setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getAmplitudeMenuProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  getSelectedStatus(value) {
    return this.statusTypes.find((status) => status.action === value);
  }

  getSelectedMembership(value) {
    return this.membershipTypes.find((membership) => membership.action === value);
  }

  onSelectedStatus(type) {
    this.form.get('status').setValue(type.action);
  }

  onSelectedMembership(type) {
    this.form.get('has_membership').setValue(type.action);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.get('room_info').setValue('');
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.get('address').value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(location.latitude, location.longitude);
  }

  onPlaceChange(data) {
    if (!data) {
      return;
    }

    this.drawMarker.next(true);

    if ('fromUsersLocations' in data) {
      this.updateWithUserLocation(data);

      return;
    }

    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.name };

    const coords: google.maps.LatLngLiteral = data.geometry.location.toJSON();

    CPMap.setFormLocationData(this.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onLocationToggle(value) {
    this.showLocationDetails = value;
    const requiredValidator = value ? [Validators.required] : null;
    this.form.get('address').setValidators(requiredValidator);
    this.form.get('address').updateValueAndValidity();

    if (!value) {
      this.drawMarker.next(false);

      this.mapCenter = new BehaviorSubject({
        lat: this.school.latitude,
        lng: this.school.longitude
      });

      this.form.get('room_info').setValue('');
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    }
  }

  setLocationVisibility(club) {
    if (!this.isEdit) {
      return;
    }

    const address = this.form.get('address');
    if (!address.value) {
      address.setValidators(null);
      address.updateValueAndValidity();
    }

    this.showLocationDetails = CPMap.canViewLocation(club.latitude, club.longitude, this.school);
  }

  initialize() {
    const club = this.form.value;

    this.labels = clubAthleticLabels(this.isAthletic);
    this.selectedStatus = this.getSelectedStatus(club.status);
    this.selectedMembership = this.getSelectedMembership(club.has_membership);

    this.setLocationVisibility(club);
    this.drawMarker.next(this.showLocationDetails);

    this.mapCenter = new BehaviorSubject(
      CPMap.setDefaultMapCenter(club.latitude, club.longitude, this.school)
    );

    this.hasMemberShip =
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation) &&
      canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.membership);
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    this.initialize();
  }
}
