import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CPMap } from '../../../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../../../session';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  @Input() storeForm;

  school: ISchool;
  showLocationDetails = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService
  ) {}

  onUploadedImage(image) {
    this.storeForm.controls['logo_url'].setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onResetMap() {
    this.drawMarker.next(false);
    CPMap.setFormLocationData(this.storeForm, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.storeForm, location);

    this.newAddress.next(this.storeForm.controls['address'].value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.storeForm, location);

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

    CPMap.setFormLocationData(this.storeForm, location);

    this.centerMap(coords.lat, coords.lng);
  }

  onLocationToggle(value) {
    this.showLocationDetails = value;

    if (!value) {
      this.drawMarker.next(false);

      this.mapCenter = new BehaviorSubject({
        lat: this.school.latitude,
        lng: this.school.longitude
      });

      CPMap.setFormLocationData(this.storeForm, CPMap.resetLocationFields());
    }
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    const lat = this.storeForm.controls.latitude.value;
    const lng = this.storeForm.controls.longitude.value;

    this.showLocationDetails = CPMap.canViewLocation(lat, lng, this.school);
    this.drawMarker.next(this.showLocationDetails);
    this.mapCenter = new BehaviorSubject(CPMap.setDefaultMapCenter(lat, lng, this.school));
  }
}
