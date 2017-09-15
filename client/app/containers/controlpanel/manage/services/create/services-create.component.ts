import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { CPSession, ISchool } from '../../../../../session';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

const ATTENDANCE_ENABLED = 1;
const ATTENDANCE_DISABLED = 0;

const FEEDBACK_ENABLED = 1;
const FEEDBACK_DISABLED = 0;

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {
  buttonData;
  storeId: number;
  school: ISchool;
  form: FormGroup;
  formError = false;
  attendance = false;
  mapCenter: BehaviorSubject<any>;
  categories$: Observable<any>;

  feedbackOptions = [
    {
      'label': 'Enabled',
      'value': FEEDBACK_ENABLED
    },
    {
      'label': 'Disabled',
      'value': FEEDBACK_DISABLED
    }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private servicesService: ServicesService
  ) {
    this.buildHeader();
    this.categories$ = this
      .servicesService
      .getCategories()
      .startWith([{ label: '---', action: null }])
      .map(categories => {
        let _categories = [
          {
            label: '---',
            action: null
          }
        ]
        categories.map(category => {
          _categories.push(
            {
              action: category.id,
              label: category.name
            }
          )
        })
        return _categories;
      });
  }

  onPlaceChanged(data) {
    if (!data) { return; }

    let cpMap = CPMap.getBaseMapObject(data);

    this.form.controls['city'].setValue(cpMap.city);
    this.form.controls['province'].setValue(cpMap.province);
    this.form.controls['country'].setValue(cpMap.country);
    this.form.controls['latitude'].setValue(cpMap.latitude);
    this.form.controls['longitude'].setValue(cpMap.longitude);
    this.form.controls['address'].setValue(`${cpMap.street_number} ${cpMap.street_name}`);
    this.form.controls['postal_code'].setValue(cpMap.postal_code);

    this.mapCenter.next(data.geometry.location.toJSON());
  }

  onSelectedFeedback(feedback) {
    this.form.controls['enable_feedback'].setValue(feedback.value);
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Create Service',
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  onSubmit() {
    this.formError = false;

    if (!this.form.valid) {
      this.formError = true;
      return;
    }

    let data = Object.assign(this.form.value);

    let { service_attendance } = data;

    if (service_attendance === ATTENDANCE_DISABLED || service_attendance == null) {
      data.enable_feedback = null;
    }

    this
      .servicesService
      .createService(
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
        enable_feedback: data.enable_feedback,
        service_attendance: data.service_attendance,
        rating_scale_maximum: data.rating_scale_maximum,
        default_basic_feedback_label: data.default_basic_feedback_label,
      })
      .catch(err => Observable.throw(err))
      .subscribe(service => {
        if (service.service_attendance) {
          this.router.navigate(['/manage/services/' + service.id]);
          return;
        }

        this.router.navigate(['/manage/services/' + service.id + '/info']);
      });
  }

  onToggleAttendance(event) {
    if (event) {
      this.form.controls['default_basic_feedback_label'].setValue('How did you like the service?');
    } else {
      this.form.controls['default_basic_feedback_label'].setValue(null);
    }

    this
      .form
      .controls['service_attendance']
      .setValue(event ? ATTENDANCE_ENABLED : ATTENDANCE_DISABLED);
  }

  ngOnInit() {
    this.school = this.session.school;

    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: 'Create Service'
    }

    this.storeId = this.school.main_union_store_id;
    this.mapCenter = new BehaviorSubject(
      {
        lat: this.school.latitude,
        lng: this.school.longitude
      }
    );

    this.form = this.fb.group({
      'name': [null, Validators.required],
      'logo_url': [null, Validators.required],
      'category': [null, Validators.required],
      'location': [null],
      'room_data': [null],
      'address': [null],
      'description': [null],
      'email': [null],
      'website': [null],
      'contactphone': [null],
      'secondary_name': [null],
      'city': [null],
      'province': [null],
      'country': [null],
      'postal_code': [null],
      'latitude': [this.school.latitude],
      'longitude': [this.school.longitude],
      'service_attendance': [null],
      'rating_scale_maximum': [null],
      'default_basic_feedback_label': [null],
      'enable_feedback': [FEEDBACK_ENABLED]
    });

    this.form.valueChanges.subscribe(_ => {
      this.buttonData = Object.assign({}, this.buttonData, { disabled: !this.form.valid });
    })
  }
}
