import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { ProvidersService } from '../providers.service';
import { CPSession, ISchool } from '../../../../../session';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/utils/privileges';
import { IServiceDeleteModal } from './components/service-edit-delete-modal';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

declare var $: any;

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent extends BaseComponent implements OnInit {
  loading;
  service;
  withAttendance;
  school: ISchool;
  storeId: number;
  categories = [];
  form: FormGroup;
  formError = false;
  serviceId: number;
  attendance = false;
  mapCenter: BehaviorSubject<any>;
  deletedItem: IServiceDeleteModal = {
    id: null,
    name: null,
    type: null,
    index: null
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private session: CPSession,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private servicesService: ServicesService,
    private providersService: ProvidersService
  ) {
    super();
    this.school = this.session.school;
    super.isLoading().subscribe(res => this.loading = res);
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
    this.buildHeader();
  }

  private fetch() {
    let searchProviders = new URLSearchParams();
    let searchAdmin = new URLSearchParams();

    searchProviders.append('service_id', this.serviceId.toString());

    searchAdmin.append('school_id', this.school.id.toString());
    searchAdmin.append('store_id', this.serviceId.toString());
    searchAdmin.append('privilege_type', CP_PRIVILEGES_MAP.events.toString());

    const service$ = this.servicesService.getServiceById(this.serviceId);
    const providers$ = this.providersService.getProviders(1, 1000, searchProviders);

    const stream$ = Observable.combineLatest(service$, providers$);
    super
      .fetchData(stream$)
      .then(res => {

        let providers = res.data[1];

        this.service = res.data[0];
        this.mapCenter = new BehaviorSubject(
          {
            lat: res.data[0].latitude,
            lng: res.data[0].longitude
          }
        );

        this.storeId = res.data[0].store_id;

        this.buildForm();

        if (providers.length) {
          let control = <FormArray>this.form.controls['providers'];
          providers.forEach(provider => control.push(this.buildServiceProviderControl(provider)));
        }
      })
      .catch(err => console.error(err));
  }

  onPlaceChanged(data) {
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

    let search = new URLSearchParams();
    search.append('service_id', this.serviceId.toString());

    this
      .providersService
      .deleteProvider(data.id, search)
      .subscribe(
      _ => controls.removeAt(data.index),
      err => console.error(err)
      );
  }

  onDelete(event) {
    if (event.type === 'provider') {
      this.deleteProvider(event);
      return;
    }
  }

  buildServiceProviderControl(provider?: any) {
    if (provider) {
      return this.fb.group({
        'id': [provider.id],
        'provider_name': [provider.provider_name],
        'email': [provider.email],
        'custom_basic_feedback_label': [provider.custom_basic_feedback_label]
      });
    }
    return this.fb.group({
      'provider_name': [null],
      'email': [null],
      'custom_basic_feedback_label': [null]
    });
  }

  buildForm() {
    this.form = this.fb.group({
      'name': [this.service.name, Validators.required],
      'logo_url': [this.service.logo_url, Validators.required],
      'category': [this.service.category, Validators.required],
      'location': [this.service.location],
      'room_data': [this.service.room_data],
      'address': [this.service.address],
      'description': [this.service.description],
      'email': [this.service.email],
      'website': [this.service.website],
      'phone': [this.service.phone],
      'secondary_name': [this.service.secondary_name],
      'city': [this.service.city],
      'province': [this.service.province],
      'country': [this.service.country],
      'postal_code': [this.service.postal_code],
      'latitude': [this.service.latitude],
      'longitude': [this.service.longitude],
      'service_attendance': [this.service.service_attendance],
      'rating_scale_maximum': [this.service.rating_scale_maximum],
      'default_basic_feedback_label': [this.service.default_basic_feedback_label],
      'providers': this.fb.array([])
    });
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Edit Service',
        'subheading': null,
        'em': null,
        'children': []
      }
    });
  }

  onSubmit() {
    this.formError = false;

    if (this.form.controls['providers'].dirty) {
      let adminControls = <FormArray>this.form.controls['providers'];
      adminControls.controls.forEach((control: FormGroup) => {
        if (control.dirty && control.touched) {
          Object.keys(control.controls).forEach(key => {
            if (!control.controls[key].value) {
              this.formError = true;
              control.controls[key].setErrors({ 'required': true });
            }
          });
        }
      });
    }

    if (!this.form.valid) {
      this.formError = true;
      return;
    }

    let data = Object.assign(this.form.value);

    this
      .servicesService
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
        phone: data.phone,
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
        default_basic_feedback_label: data.default_basic_feedback_label,
      },
      this.serviceId
      )
      .switchMap(service => {
        this.withAttendance = service.service_attendance;
        let providers = [];
        let search = new URLSearchParams();
        let controls = <FormArray>this.form.controls['providers'];
        let providersControls = controls.controls;

        providersControls.forEach((provider: FormGroup) => {
          providers.push({
            'id': provider.controls['id'].value,
            'provider_name': provider.controls['provider_name'].value,
            'email': provider.controls['email'].value,
            'custom_basic_feedback_label': provider.controls['custom_basic_feedback_label'].value
          });
        });

        search.append('service_id', this.serviceId.toString());
        return this.providersService.updateProvider(providers, search);
      })
      .catch(err => Observable.throw(err))
      .subscribe(_ => {
        if (this.withAttendance) {
          this.router.navigate(['/manage/services/' + this.serviceId ]);
          return;
        }

        this.router.navigate(['/manage/services/' + this.serviceId + '/info']);
      });
  }

  ngOnInit() {
    let categories = require('../categories.json');

    categories.map(category => {
      this.categories.push({
        label: category.name,
        action: category.id
      });
    });
  }
}
