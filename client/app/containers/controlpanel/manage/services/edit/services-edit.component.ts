import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { CPSession, ISchool } from '../../../../../session';
import { ServicesUtilsService } from '../services.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { RatingScale, ServiceAttendance } from '../services.status';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent extends BaseComponent implements OnInit {
  loading;
  service;
  categories;
  buttonData;
  errorMessage;
  categoryTooltip;
  school: ISchool;
  form: FormGroup;
  selectedCategory;
  formError = false;
  serviceId: number;
  attendance = false;
  showLocationDetails = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);

  eventProperties = {
    phone: null,
    email: null,
    website: null,
    feedback: null,
    location: null,
    service_id: null,
    assessment: null,
    category_name: null
  };

  constructor(
    public router: Router,
    private fb: FormBuilder,
    public session: CPSession,
    private store: Store<IHeader>,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    public servicesService: ServicesService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  private fetch() {
    const service$ = this.servicesService.getServiceById(this.serviceId);
    const categories$ = this.servicesService.getCategories().pipe(
      map((categories: Array<any>) => {
        return categories.map((category) => {
          return {
            action: category.id,
            label: category.name
          };
        });
      })
    );

    const stream$ = combineLatest(service$, categories$);
    super.fetchData(stream$).then((res) => {
      const lat = res.data[0].latitude;

      const lng = res.data[0].longitude;

      this.service = res.data[0];

      this.categories = res.data[1];

      this.buildForm(res.data[0]);

      this.showLocationDetails = CPMap.canViewLocation(lat, lng, this.school);
      this.drawMarker.next(this.showLocationDetails);

      this.mapCenter = new BehaviorSubject(CPMap.setDefaultMapCenter(lat, lng, this.school));

      this.selectedCategory = this.getFromArray(this.categories, 'action', this.service.category);

      this.eventProperties = {
        ...this.eventProperties,
        category_name: this.selectedCategory.label
      };
    });
  }

  buildForm(service) {
    this.form = this.fb.group({
      name: [service.name, Validators.required],
      logo_url: [service.logo_url, Validators.required],
      category: [service.category, Validators.required],
      location: [service.location],
      room_data: [service.room_data],
      address: [service.address],
      description: [service.description],
      email: [service.email],
      website: [service.website],
      contactphone: [service.contactphone],
      secondary_name: [service.secondary_name],
      city: [service.city],
      province: [service.province],
      country: [service.country],
      postal_code: [service.postal_code],
      latitude: [service.latitude],
      longitude: [service.longitude],
      service_attendance: [service.service_attendance],
      rating_scale_maximum: [service.rating_scale_maximum],
      default_basic_feedback_label: [service.default_basic_feedback_label]
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = {
        ...this.buttonData,
        disabled: !this.form.valid
      };
    });
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;

      return;
    }

    this.servicesService.updateService(this.form.value, this.serviceId).subscribe(
      (service: any) => {
        const route = !service.service_attendance ? '/info' : '';

        this.trackEvent(this.form.value);
        this.router.navigate(['/manage/services/' + this.serviceId + route]);
      },
      (_) => {
        this.enableSaveButton();
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  getFromArray(arr: Array<any>, key: string, val: string) {
    return arr.filter((item) => item[key] === val)[0];
  }

  onUploadedImage(image) {
    this.form.controls.logo_url.setValue(image);

    if (image) {
      this.trackUploadImageEvent();
    }
  }

  trackUploadImageEvent() {
    const properties = this.cpTracking.getEventProperties();

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.UPLOADED_PHOTO, properties);
  }

  onResetMap() {
    this.drawMarker.next(false);
    this.form.controls['room_data'].setValue('');
    CPMap.setFormLocationData(this.form, CPMap.resetLocationFields());
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

  onToggleAttendance(event) {
    const serviceAttendance = event ? ServiceAttendance.enabled : ServiceAttendance.disabled;

    const feedbackLabel = !event
      ? null
      : this.cpI18n.translate('services_default_feedback_question');

    const maxScale = event ? RatingScale.maxScale : RatingScale.noScale;

    this.form.controls['rating_scale_maximum'].setValue(maxScale);
    this.form.controls['service_attendance'].setValue(serviceAttendance);
    this.form.controls['default_basic_feedback_label'].setValue(feedbackLabel);
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'services_edit_heading',
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  onCategoryUpdate(category) {
    this.form.controls['category'].setValue(category.action);

    this.eventProperties = {
      ...this.eventProperties,
      category_name: category.label
    };
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
    }
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data, this.serviceId)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_UPDATED_SERVICE,
      this.eventProperties
    );
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.school = this.session.g.get('school');
    this.fetch();
    this.buildHeader();

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };

    this.categoryTooltip = {
      ...this.categoryTooltip,
      content: this.cpI18n.translate('manage_create_service_category_tooltip')
    };
  }
}
