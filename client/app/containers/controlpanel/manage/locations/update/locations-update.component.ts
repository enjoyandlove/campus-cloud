import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';

import { CPSession } from '../../../../../session';
import { CPMap } from '../../../../../shared/utils';
import { BaseComponent } from '../../../../../base';
import { LocationsService } from '../locations.service';
import { baseActions, IHeader } from '../../../../../store/base';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss']
})
export class LocationsUpdateComponent extends BaseComponent implements OnInit {
  school;
  loading;
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
    public store: Store<IHeader>,
    public service: LocationsService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.locationId = this.route.snapshot.params['locationId'];
  }

  onResetMap() {
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);
  }

  doSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service
      .updateLocation(this.form.value, this.locationId, search)
      .subscribe(() => {
        this.router.navigate(['/manage/locations']);
      });
  }
  public fetch() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    // todo: add location Interface
    super.fetchData(this.service.getLocationById(this.locationId, search)).then((location) => {
      this.buildForm(location.data);
    });
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
      type: baseActions.HEADER_UPDATE,
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

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('update')
    };
  }
}
