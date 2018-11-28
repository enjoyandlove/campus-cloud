import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '../../../../../store';
import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base';
import { LocationsService } from '../locations.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';
import { ILocation } from '@containers/controlpanel/manage/locations/locations.interface';

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss']
})
export class LocationsUpdateComponent extends BaseComponent implements OnInit {
  school;
  loading$;
  buttonData;
  locationId;
  form: FormGroup;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  eventProperties = {
    acronym: null,
    location_id: null
  };

  constructor(
    public router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: LocationsService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>,
  ) {
    super();
    this.locationId = this.route.snapshot.params['locationId'];
  }

  onResetMap() {
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  doSubmit() {
    const body = this.form.value;
    const locationId = this.locationId;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      body,
      params,
      locationId
    };

    this.store.dispatch(new fromStore.EditLocation(payload));
  }

  public fetch() {
    const locationId = this.locationId;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      params,
      locationId
    };

    this.store.dispatch(new fromStore.GetLocationById(payload));
  }

  onMapSelection(data) {
    const cpMap = CPMap.getBaseMapObject(data);

    const location = { ...cpMap, address: data.formatted_address };

    CPMap.setFormLocationData(this.form, location);

    this.newAddress.next(this.form.controls['address'].value);
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

  buildHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: `t_locations_edit_location`,
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  buildForm(location) {
    this.mapCenter = new BehaviorSubject({
      lat: location.latitude,
      lng: location.longitude
    });

    this.form = this.fb.group({
      city: [location.city],
      country: [location.country],
      province: [location.province],
      postal_code: [location.postal_code],
      name: [location.name, Validators.required],
      address: [location.address, Validators.required],
      latitude: [location.latitude, Validators.required],
      longitude: [location.longitude, Validators.required],
      short_name: [location.short_name, Validators.maxLength(32)]
    });
  }

  ngOnInit() {
    this.fetch();
    this.buildHeader();
    this.school = this.session.g.get('school');
    this.loading$ = this.store.select(fromStore.getLocationsLoading);
    this.store.select(fromStore.getLocations).subscribe((location: ILocation[]) => this.buildForm(location));

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('update')
    };
  }
}
