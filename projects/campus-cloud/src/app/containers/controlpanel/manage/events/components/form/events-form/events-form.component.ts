import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { FORMAT } from '@campus-cloud/shared/pipes';
import { CPDate, CPMap } from '@campus-cloud/shared/utils';
import { CPSession, ISchool } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CPI18nService, CPTrackingService, StoreService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.scss']
})
export class EventsFormComponent implements OnInit {
  @Input() isClub;
  @Input() isEdit;
  @Input() formError;
  @Input() isService;
  @Input() isOrientation;
  @Input() form: FormGroup;

  dateFormat = FORMAT.DATETIME;

  @Output() selectHost: EventEmitter<number> = new EventEmitter();
  @Output() amplitudeProperties: EventEmitter<any> = new EventEmitter();

  stores;
  selectedHost;
  eventProperties;
  school: ISchool;
  selectedManager;
  showLocationDetails = true;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public storeService: StoreService,
    public cpTracking: CPTrackingService
  ) {}

  onUploadedImage(image) {
    this.form.controls['poster_url'].setValue(image);
    this.form.controls['poster_thumb_url'].setValue(image);

    if (image) {
      this.trackUploadImageEvent();

      this.eventProperties = {
        ...this.eventProperties,
        updated_image: amplitudeEvents.YES
      };

      this.amplitudeProperties.emit(this.eventProperties);
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getAmplitudeMenuProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  setStart(startTimeStamp: number) {
    this.form.controls['start'].setValue(startTimeStamp);
  }

  setEnd(startTimeStamp: number) {
    this.form.controls['end'].setValue(startTimeStamp);
  }

  onAllDayToggle(value) {
    this.form.controls['is_all_day'].setValue(value);
  }

  onSelectedHost(host): void {
    this.eventProperties = {
      ...this.eventProperties,
      host_type: host.hostType
    };

    this.selectHost.emit(host.value);
    this.amplitudeProperties.emit(this.eventProperties);
    this.form.controls['store_id'].setValue(host.value);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_data'].setValue('');
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    this.centerMap(this.school.latitude, this.school.longitude);

    this.eventProperties = {
      ...this.eventProperties,
      updated_location: amplitudeEvents.REMOVED_LOCATION
    };

    this.amplitudeProperties.emit(this.eventProperties);
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

    this.drawMarker.next(true);

    this.eventProperties = {
      ...this.eventProperties,
      updated_location: amplitudeEvents.ADDED_LOCATION
    };

    this.amplitudeProperties.emit(this.eventProperties);

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

      this.form.controls['room_data'].setValue('');
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());

      this.eventProperties = {
        ...this.eventProperties,
        updated_location: amplitudeEvents.REMOVED_LOCATION
      };

      this.amplitudeProperties.emit(this.eventProperties);
    }
  }

  setLocationVisibility(event) {
    if (!this.isEdit) {
      return;
    }

    const address = this.form.get('address');
    if (!address.value) {
      address.setValidators(null);
      address.updateValueAndValidity();
    }

    this.showLocationDetails = CPMap.canViewLocation(event.latitude, event.longitude, this.school);
  }

  initialize() {
    const event = this.form.value;
    const search: HttpParams = new HttpParams().append('school_id', this.school.id.toString());

    const stores$ = this.storeService.getStores(search);

    stores$.subscribe((stores) => {
      this.stores = stores;
      this.selectedHost = EventUtilService.getFromArray(stores, 'value', event.store_id);

      this.eventProperties = {
        ...this.eventProperties,
        host_type: this.selectedHost ? this.selectedHost.hostType : null
      };

      this.amplitudeProperties.emit(this.eventProperties);
    });

    this.mapCenter = new BehaviorSubject(
      CPMap.setDefaultMapCenter(event.latitude, event.longitude, this.school)
    );

    this.setLocationVisibility(event);

    this.drawMarker.next(this.showLocationDetails);
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    this.initialize();
  }
}
