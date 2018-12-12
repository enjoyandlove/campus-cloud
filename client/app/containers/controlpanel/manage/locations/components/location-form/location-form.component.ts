import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CPMap } from '@shared/utils';
import { LocationModel } from '../../model';
import { CPSession, ISchool } from '@app/session';

@Component({
  selector: 'cp-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss']
})
export class LocationFormComponent implements OnInit {
  @Input() formErrors: boolean;
  @Input() location: LocationModel;

  categories;
  school: ISchool;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  constructor(private session: CPSession) {}


  onResetMap() {
    CPMap.setFormLocationData(this.location.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
    this.location.form.get('latitude').setValue(this.school.latitude);
    this.location.form.get('longitude').setValue(this.school.longitude);
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.location.form, location);

    this.newAddress.next(this.location.form.get('address').value);
  }

  updateWithUserLocation(location) {
    location = Object.assign({}, location, { location: location.name });

    CPMap.setFormLocationData(this.location.form, location);

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

    CPMap.setFormLocationData(this.location.form, location);

    this.centerMap(coords.lat, coords.lng);
  }

  centerMap(lat: number, lng: number) {
    return this.mapCenter.next({ lat, lng });
  }

  onSelectedCategory(category) {
    this.location.form.get('category_id').setValue(category.value);
  }

  onUploadedImage(image) {
    this.location.form.get('image_url').setValue(image);
  }

  ngOnInit(): void {
    this.school = this.session.g.get('school');
    const lat = this.location.form.get('latitude').value;
    const lng = this.location.form.get('longitude').value;

    this.mapCenter = new BehaviorSubject({
      lat: lat ? lat : this.school.latitude,
      lng: lng ? lng : this.school.longitude
    });

    // temporary will be replaced with actual
    this.categories = [
      {
        value: null,
        label: 'Select Category'
      },
      {
        value: 1,
        label: 'Dining'
      },
      {
        value: 2,
        label: 'New Dining'
      }
    ];
  }
}
