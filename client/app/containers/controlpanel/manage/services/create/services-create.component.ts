import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { CPSession, ISchool } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';
import { IToolTipContent } from '../../../../../shared/components/cp-tooltip/cp-tooltip.interface';

const ATTENDANCE_ENABLED = 1;
const ATTENDANCE_DISABLED = 0;

const FEEDBACK_ENABLED = 1;
const FEEDBACK_DISABLED = 0;

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss'],
})
export class ServicesCreateComponent implements OnInit {
  @Input() toolTipContent: IToolTipContent;

  feedback;
  category;
  buttonData;
  storeId: number;
  school: ISchool;
  form: FormGroup;
  formError = false;
  attendance = false;
  categories$: Observable<any>;
  mapCenter: BehaviorSubject<any>;
  newAddress = new BehaviorSubject(null);

  feedbackOptions = [
    {
      label: this.cpI18n.translate('enabled'),
      value: FEEDBACK_ENABLED,
    },
    {
      label: this.cpI18n.translate('disabled'),
      value: FEEDBACK_DISABLED,
    },
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private cpI18n: CPI18nService,
    private servicesService: ServicesService,
  ) {
    this.buildHeader();
    this.categories$ = this.servicesService
      .getCategories()
      .startWith([{ label: '---', action: null }])
      .map((categories) => {
        const _categories = [
          {
            label: '---',
            action: null,
          },
        ];
        categories.map((category) => {
          _categories.push({
            action: category.id,
            label: category.name,
          });
        });

        return _categories;
      });
  }

  onResetMap() {
    CPMap.setFormLocationData(
      this.form,
      CPMap.resetLocationFields(this.school),
    );
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

  onSelectedFeedback(feedback) {
    this.form.controls['enable_feedback'].setValue(feedback.value);
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'services_create_heading',
        subheading: null,
        em: null,
        children: [],
      },
    });
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;

      return;
    }

    const data = Object.assign(this.form.value);

    const { service_attendance } = data;

    if (
      service_attendance === ATTENDANCE_DISABLED ||
      service_attendance == null
    ) {
      data.enable_feedback = null;
    }

    this.servicesService
      .createService({
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
        enable_feedback: data.enable_feedback,
        service_attendance: data.service_attendance,
        rating_scale_maximum: data.rating_scale_maximum,
        default_basic_feedback_label: data.default_basic_feedback_label,
      })
      .catch((err) => Observable.throw(err))
      .subscribe((service) => {
        if (service.service_attendance) {
          this.router.navigate(['/manage/services/' + service.id]);

          return;
        }

        this.router.navigate(['/manage/services/' + service.id + '/info']);
      });
  }

  onToggleAttendance(event) {
    if (event) {
      this.form.controls['default_basic_feedback_label'].setValue(
        this.cpI18n.translate('services_default_feedback_question'),
      );
    } else {
      this.form.controls['default_basic_feedback_label'].setValue(null);
    }

    this.form.controls['service_attendance'].setValue(
      event ? ATTENDANCE_ENABLED : ATTENDANCE_DISABLED,
    );
  }

  ngOnInit() {
    this.feedback = Object.assign({}, this.feedback, {
      content: this.cpI18n.translate('manage_create_service_feedback_tooltip'),
    });

    this.category = Object.assign({}, this.category, {
      content: this.cpI18n.translate('manage_create_service_category_tooltip'),
    });

    this.school = this.session.g.get('school');

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('services_create_button_create'),
    };

    this.storeId = this.school.main_union_store_id;
    this.mapCenter = new BehaviorSubject({
      lat: this.school.latitude,
      lng: this.school.longitude,
    });

    this.form = this.fb.group({
      name: [null, Validators.required],
      logo_url: [null, Validators.required],
      category: [null, Validators.required],
      location: [null],
      room_data: [null],
      address: [null],
      description: [null],
      email: [null],
      website: [null],
      contactphone: [null],
      secondary_name: [null],
      city: [null],
      province: [null],
      country: [null],
      postal_code: [null],
      latitude: [this.school.latitude],
      longitude: [this.school.longitude],
      service_attendance: [null],
      rating_scale_maximum: [null],
      default_basic_feedback_label: [null],
      enable_feedback: [FEEDBACK_ENABLED],
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid,
      });
    });
  }
}
