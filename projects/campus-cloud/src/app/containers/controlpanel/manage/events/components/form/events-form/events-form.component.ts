import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { CPSession, ISchool } from '@campus-cloud/session';
import { CPDate, CPMap } from '@campus-cloud/shared/utils';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CPI18nService, CPTrackingService, StoreService } from '@campus-cloud/shared/services';

const FORMAT_WITH_TIME = 'F j, Y h:i K';
const FORMAT_WITHOUT_TIME = 'F j, Y';
const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
};

@Component({
  selector: 'cp-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.scss']
})
export class EventsFormComponent implements OnInit {
  @Input() isClub;
  @Input() formError;
  @Input() isService;
  @Input() isOrientation;
  @Input() form: FormGroup;

  @Output() selectHost: EventEmitter<number> = new EventEmitter();
  @Output() amplitudeProperties: EventEmitter<any> = new EventEmitter();

  stores;
  selectedHost;
  eventProperties;
  school: ISchool;
  selectedManager;
  enddatePickerOpts;
  startdatePickerOpts;
  showLocationDetails = false;
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
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  setStart(date) {
    this.form.controls['start'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setEnd(date) {
    this.form.controls['end'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  updateDatePicker() {
    const _self = this;
    const end = this.form.controls['end'].value;
    const start = this.form.controls['start'].value;

    this.startdatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: start ? CPDate.fromEpochLocal(start, _self.session.tz).format() : null
    };
    this.enddatePickerOpts = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: start ? CPDate.fromEpochLocal(end, _self.session.tz).format() : null
    };
  }

  toggleDatePickerTime(checked) {
    const dateFormat = checked ? FORMAT_WITHOUT_TIME : FORMAT_WITH_TIME;

    this.startdatePickerOpts = {
      ...this.startdatePickerOpts,
      enableTime: !checked,
      dateFormat
    };

    this.enddatePickerOpts = {
      ...this.enddatePickerOpts,
      enableTime: !checked,
      dateFormat
    };
  }

  onAllDayToggle(value) {
    this.toggleDatePickerTime(value);
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

    this.showLocationDetails = CPMap.canViewLocation(event.latitude, event.longitude, this.school);

    this.drawMarker.next(this.showLocationDetails);
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    this.initialize();
    this.updateDatePicker();
  }
}
