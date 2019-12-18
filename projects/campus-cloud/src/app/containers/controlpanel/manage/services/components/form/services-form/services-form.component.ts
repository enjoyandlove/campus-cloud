import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { get as _get } from 'lodash';

import { CPMap } from '@campus-cloud/shared/utils';
import { CPSession, ISchool } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ServicesService } from '@controlpanel/manage/services/services.service';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

@Component({
  selector: 'cp-services-form',
  templateUrl: './services-form.component.html',
  styleUrls: ['./services-form.component.scss']
})
export class ServicesFormComponent implements OnInit {
  @Input() isEdit;
  @Input() formError;
  @Input() form: FormGroup;

  @Output() amplitudeProperties: EventEmitter<any> = new EventEmitter();

  eventProperties;
  school: ISchool;
  selectedCategory;
  selectedMembership;
  showLocationDetails = true;
  categories = [{ label: '---' }];
  mapCenter: BehaviorSubject<any>;
  membershipTypes = this.utils.membershipTypes;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);
  categoryTooltip = this.cpI18n.translate('manage_create_service_category_tooltip');

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    public servicesService: ServicesService
  ) {}

  onSelectedMembership(type) {
    this.form.get('has_membership').setValue(type.action);
  }

  onCategoryUpdate(category) {
    this.form.get('category').setValue(category.action);

    this.eventProperties = {
      ...this.eventProperties,
      category_name: category.label
    };

    this.amplitudeProperties.emit(this.eventProperties);
  }

  onUploadedImage(image) {
    this.form.get('logo_url').setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getAmplitudeMenuProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
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

      this.form.get('room_data').setValue('');
      CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
    }
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.get('room_data').setValue('');
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

  setLocationVisibility(service) {
    if (!this.isEdit) {
      return;
    }

    const address = this.form.get('address');
    if (!address.value) {
      address.setValidators(null);
      address.updateValueAndValidity();
    }

    this.showLocationDetails = CPMap.canViewLocation(
      service.latitude,
      service.longitude,
      this.school
    );
  }

  fetchCategories() {
    this.servicesService.getCategories().subscribe((categories) => {
      this.categories = ServicesUtilsService.parseServiceCategories(categories);
      this.selectedCategory = ServicesUtilsService.getFromArray(
        this.categories,
        'action',
        this.form.value.category
      );

      const category_name = _get(this.selectedCategory, 'label', '');

      this.eventProperties = {
        category_name,
        ...this.eventProperties
      };

      this.amplitudeProperties.emit(this.eventProperties);
    });
  }

  initialize() {
    this.fetchCategories();
    const service = this.form.value;
    this.school = this.session.g.get('school');

    this.setLocationVisibility(service);
    this.drawMarker.next(this.showLocationDetails);

    this.mapCenter = new BehaviorSubject(
      CPMap.setDefaultMapCenter(service.latitude, service.longitude, this.school)
    );

    this.selectedMembership = this.membershipTypes.find(
      (type) => type.action === service.has_membership
    );
  }

  ngOnInit() {
    this.initialize();
  }
}
