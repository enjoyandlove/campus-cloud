import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CPMap } from '../../../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../../../session';
import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';

@Component({
  selector: 'cp-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.scss']
})
export class StoreFormComponent implements OnInit {
  @Input() storeForm;

  school: ISchool;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  constructor(
    public session: CPSession,
    public cpTracking: CPTrackingService) {}

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
    CPMap.setFormLocationData(this.storeForm, CPMap.resetLocationFields(this.school));
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

  ngOnInit() {
    this.school = this.session.g.get('school');
    const latitude = this.storeForm.controls.latitude.value;
    const longitude = this.storeForm.controls.longitude.value;

    this.mapCenter = new BehaviorSubject({
      lat: latitude ? latitude : this.school.latitude,
      lng: longitude ? longitude : this.school.longitude
    });
  }
}
