import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  ChangeDetectorRef,
  HostListener,
  ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { HttpParams } from '@angular/common/http';

import { CPMap } from '../../../../../shared/utils';
import { CPSession, ISchool } from '../../../../../session';
import { getAcronym, LocationsService } from '../locations.service';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services/index';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';

declare var $: any;

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit {
  @Output() teardown: EventEmitter<null> = new EventEmitter();
  @Output() locationCreated: EventEmitter<any> = new EventEmitter();

  buttonData;
  form: FormGroup;
  school: ISchool;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  eventProperties = {
    acronym: null,
    location_id: null
  };

  constructor(
    public el: ElementRef,
    private fb: FormBuilder,
    private session: CPSession,
    public cpI18n: CPI18nService,
    public cdRef: ChangeDetectorRef,
    public service: LocationsService,
    public cpTracking: CPTrackingService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  onResetMap() {
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields(this.school));
    this.centerMap(this.school.latitude, this.school.longitude);
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

  doSubmit() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.createLocation(this.form.value, search).subscribe((newLocation) => {
      this.trackEvent(newLocation);
      $('#locationsUpdate').modal('hide');
      this.locationCreated.emit(newLocation);
      $('#locationsCreate').modal('hide');
      this.resetModal();
    });
  }

  resetModal() {
    this.teardown.emit();
  }

  trackEvent(res) {
    this.eventProperties = {
      ...this.eventProperties,
      location_id: res.id,
      acronym: getAcronym(res.short_name)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_LOCATION,
      this.eventProperties);
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    this.mapCenter = new BehaviorSubject({
      lat: this.school.latitude,
      lng: this.school.longitude
    });

    this.form = this.fb.group({
      name: [null, Validators.required],
      short_name: [null, Validators.maxLength(32)],
      address: [null, Validators.required],
      city: [null],
      province: [null],
      country: [null],
      postal_code: [null],
      latitude: [this.school.latitude, Validators.required],
      longitude: [this.school.longitude, Validators.required]
    });

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('save')
    };

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };

      /**
       * INTENTIONAL
       * In order to reenable the button
       * after selecting a location from the dropdown
       */
      this.cdRef.detectChanges();
    });
  }
}
