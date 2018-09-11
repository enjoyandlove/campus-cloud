import { BehaviorSubject, combineLatest, throwError as observableThrowError } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { ProvidersService } from '../providers.service';
import { CPSession, ISchool } from '../../../../../session';
import { ServicesUtilsService } from '../services.utils.service';
import { BaseComponent } from '../../../../../base/base.component';
import { EventUtilService } from '../../events/events.utils.service';
import { attendanceType, CheckInMethod } from '../../events/event.status';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { IServiceDeleteModal } from './components/service-edit-delete-modal';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';

declare var $: any;

const FEEDBACK_ENABLED = 1;
const FEEDBACK_DISABLED = 0;

const SERVICE_FEEDBACK = {
  [FEEDBACK_ENABLED]: 'Enabled',
  [FEEDBACK_DISABLED]: 'Disabled'
};

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent extends BaseComponent implements OnInit {
  @Input() toolTipContent: IToolTipContent;

  loading;
  service;
  feedback;
  category;
  categories;
  buttonData;
  hasFeedback;
  serviceQRCodes;
  withAttendance;
  attendanceTypes;
  serviceFeedback;
  school: ISchool;
  storeId: number;
  form: FormGroup;
  selectedCategory;
  formError = false;
  serviceId: number;
  attendance = false;
  selectedQRCode = [];
  selectedAttendanceType = [];
  showLocationDetails = false;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);
  drawMarker = new BehaviorSubject(false);

  deletedItem: IServiceDeleteModal = {
    id: null,
    name: null,
    type: null,
    index: null
  };

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
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: ServicesUtilsService,
    private eventUtils: EventUtilService,
    private cpTracking: CPTrackingService,
    private servicesService: ServicesService,
    private providersService: ProvidersService
  ) {
    super();
    this.school = this.session.g.get('school');
    super.isLoading().subscribe((res) => (this.loading = res));
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
    this.buildHeader();
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

  private fetch() {
    const searchProviders = new HttpParams().append('service_id', this.serviceId.toString());

    const service$ = this.servicesService.getServiceById(this.serviceId);
    const providers$ = this.providersService.getProviders(1, 1000, searchProviders);
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

    const stream$ = combineLatest(service$, providers$, categories$);
    super.fetchData(stream$).then((res) => {
      const providers = res.data[1];

      const lat = res.data[0].latitude;

      const lng = res.data[0].longitude;

      this.service = res.data[0];

      this.hasFeedback = this.service.enable_feedback === FEEDBACK_ENABLED;

      this.categories = res.data[2];

      this.categories.map((category) => {
        if (category.action === +this.service.category) {
          this.selectedCategory = category;

          this.eventProperties = {
            ...this.eventProperties,
            category_name: category.label
          };
        }
      });

      const label =
        SERVICE_FEEDBACK[
          'enable_feedback' in this.service ? this.service.enable_feedback : FEEDBACK_ENABLED
        ];

      this.serviceFeedback = [
        {
          label,
          value: null
        }
      ];

      this.showLocationDetails = CPMap.canViewLocation(lat, lng, this.school);
      this.drawMarker.next(this.showLocationDetails);

      this.mapCenter = new BehaviorSubject(CPMap.setDefaultMapCenter(lat, lng, this.school));

      this.storeId = res.data[0].store_id;

      this.buildForm();

      if (providers.length) {
        const control = <FormArray>this.form.controls['providers'];
        providers.forEach((provider, index) =>
          control.push(this.buildServiceProviderControl(provider, index)));
      }
    });
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
    if (event) {
      this.form.controls['default_basic_feedback_label'].setValue('How did you like the service?');
      this.form.controls['service_attendance'].setValue(1);
      this.form.controls['rating_scale_maximum'].setValue(5);

      return;
    }
    this.form.controls['default_basic_feedback_label'].setValue(null);
    this.form.controls['service_attendance'].setValue(0);
    this.form.controls['rating_scale_maximum'].setValue(-1);
  }

  delteProviderControl(index): void {
    const controls = <FormArray>this.form.controls['providers'];
    const control = <FormGroup>controls.at(index);

    this.deletedItem = {
      index: index,
      type: 'provider',
      id: control.controls['id'].value,
      name: control.controls['provider_name'].value
    };

    $('#serviceEditDeleteModal').modal();
  }

  deleteProvider(data: IServiceDeleteModal) {
    const controls = <FormArray>this.form.controls['providers'];

    const search = new HttpParams().append('service_id', this.serviceId.toString());

    this.providersService.deleteProvider(data.id, search).subscribe(
      (_) => controls.removeAt(data.index),
      (err) => {
        throw new Error(err);
      }
    );
  }

  onDelete(event) {
    if (event.type === 'provider') {
      this.deleteProvider(event);

      return;
    }
  }

  buildServiceProviderControl(provider?: any, index?) {
    if (provider) {
      this.setSelectedDropDownValue(provider, index);

      return this.fb.group({
        id: [provider.id],
        provider_name: [provider.provider_name],
        email: [provider.email],
        has_checkout: [provider.has_checkout],
        checkin_verification_methods: [provider.checkin_verification_methods],
        custom_basic_feedback_label: [provider.custom_basic_feedback_label]
      });
    }

    return this.fb.group({
      provider_name: [null],
      email: [null],
      custom_basic_feedback_label: [null],
      has_checkout: [attendanceType.checkInOnly],
      checkin_verification_methods: [[CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app]]
    });
  }

  setSelectedDropDownValue(provider, index) {
    this.selectedAttendanceType[index] = this.getFromArray(
      this.eventUtils.getAttendanceTypeOptions(),
      'action',
      provider.has_checkout);

    this.selectedQRCode[index] = this.getFromArray(
      this.eventUtils.getQROptions(),
      'action',
      this.getQRCodeStatus(provider.checkin_verification_methods)
    );
  }

  getQRCodeStatus(qrCodes) {
    return qrCodes.includes(CheckInMethod.app);
  }

  getFromArray(arr: Array<any>, key: string, val: any) {
    return arr.filter((item) => item[key] === val)[0];
  }

  buildForm() {
    this.form = this.fb.group({
      name: [this.service.name, Validators.required],
      logo_url: [this.service.logo_url, Validators.required],
      category: [this.service.category, Validators.required],
      location: [this.service.location],
      room_data: [this.service.room_data],
      address: [this.service.address],
      description: [this.service.description],
      email: [this.service.email],
      website: [this.service.website],
      contactphone: [this.service.contactphone],
      secondary_name: [this.service.secondary_name],
      city: [this.service.city],
      province: [this.service.province],
      country: [this.service.country],
      postal_code: [this.service.postal_code],
      latitude: [this.service.latitude],
      longitude: [this.service.longitude],
      service_attendance: [this.service.service_attendance],
      rating_scale_maximum: [this.service.rating_scale_maximum],
      default_basic_feedback_label: [this.service.default_basic_feedback_label],
      providers: this.fb.array([])
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
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

  onSelectedAttendanceType(hasCheckout: boolean, index: number): void {
    const controls = <FormArray>this.form.controls['providers'];
    const control = <FormGroup>controls.controls[index];

    control.controls['has_checkout'].setValue(hasCheckout);
  }

  onSelectedQRCode(isEnabled: boolean, index: number): void {
    const controls = <FormArray>this.form.controls['providers'];
    const control = <FormGroup>controls.controls[index];
    const verificationMethods = control.controls['checkin_verification_methods'].value;

    if (isEnabled && !verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.push(CheckInMethod.app);
    } else if (!isEnabled && verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.pop(CheckInMethod.app);
    }
  }

  onSubmit() {
    this.formError = false;

    if (this.form.controls['providers'].dirty) {
      const adminControls = <FormArray>this.form.controls['providers'];
      adminControls.controls.forEach((control: FormGroup) => {
        if (control.dirty && control.touched) {
          Object.keys(control.controls).forEach((key) => {
            if (!control.controls[key].value) {
              this.formError = true;
              control.controls[key].setErrors({ required: true });
            }
          });
        }
      });
    }

    if (!this.form.valid) {
      this.formError = true;

      return;
    }

    const data = Object.assign({}, this.form.value);

    this.servicesService
      .updateService(
        {
          school_id: this.school.id,
          name: data.name,
          logo_url: data.logo_url,
          category: data.category,
          description: data.description,
          secondary_name: data.secondary_name,
          email: data.email,
          website: data.website,
          contactphone: data.contactphone,
          address: data.address,
          city: data.city,
          province: data.province,
          country: data.country,
          postal_code: data.postal_code,
          latitude: data.latitude,
          longitude: data.longitude,
          location: data.location,
          room_data: data.room_data,
          service_attendance: data.service_attendance,
          rating_scale_maximum: data.rating_scale_maximum,
          default_basic_feedback_label: data.default_basic_feedback_label
        },
        this.serviceId
      )
      .pipe(
        switchMap((service: any) => {
          this.withAttendance = service.service_attendance;
          const providers = [];
          const controls = <FormArray>this.form.controls['providers'];
          const providersControls = controls.controls;

          providersControls.forEach((provider: FormGroup) => {
            providers.push({
              id: provider.controls['id'].value,
              email: provider.controls['email'].value,
              has_checkout: provider.controls['has_checkout'].value,
              provider_name: provider.controls['provider_name'].value,
              custom_basic_feedback_label: provider.controls['custom_basic_feedback_label'].value,
              checkin_verification_methods: provider.controls['checkin_verification_methods'].value
            });
          });

          const search = new HttpParams().append('service_id', this.serviceId.toString());

          return this.providersService.updateProvider(providers, search);
        }),
        catchError((err) => observableThrowError(err))
      )
      .subscribe((_) => {
        this.trackEvent(data);
        if (this.withAttendance) {
          this.router.navigate(['/manage/services/' + this.serviceId]);

          return;
        }

        this.router.navigate(['/manage/services/' + this.serviceId + '/info']);
      });
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

  ngOnInit() {
    this.serviceQRCodes = this.eventUtils.getQROptions();
    this.attendanceTypes = this.eventUtils.getAttendanceTypeOptions();

    this.feedback = Object.assign({}, this.feedback, {
      content: this.cpI18n.translate('manage_create_service_feedback_tooltip')
    });

    this.category = Object.assign({}, this.category, {
      content: this.cpI18n.translate('manage_create_service_category_tooltip')
    });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
