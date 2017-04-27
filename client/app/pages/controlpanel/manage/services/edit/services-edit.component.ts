import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { ProvidersService } from '../providers.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/utils/privileges';
import { AdminService } from '../../../../../shared/services/admin.service';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent extends BaseComponent implements OnInit {
  mapCenter;
  loading;
  service;
  storeId: number;
  categories = [];
  form: FormGroup;
  formError = false;
  serviceId: number;
  attendance = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private route: ActivatedRoute,
    private adminService: AdminService,
    private servicesService: ServicesService,
    private providersService: ProvidersService
  ) {
    super();
    super.isLoading().subscribe(res => this.loading = res);
    this.serviceId = this.route.snapshot.params['serviceId'];

    this.fetch();
    this.buildHeader();
  }

  private fetch() {
    const stream$ = this.servicesService.getServiceById(this.serviceId);
    super
      .fetchData(stream$)
      .then(res => {
        this.service = res.data;
        console.log(this.service);
        this.mapCenter = { lat: res.data.latitude, lng: res.data.longitude };

        this.buildForm();
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

    this.mapCenter = data.geometry.location.toJSON();
  }

  onToggleAttendance(event) {
    if (event) {
      this.form.controls['default_basic_feedback_label'].setValue('How did you like the service?');
    } else {
      this.form.controls['default_basic_feedback_label'].setValue(null);
    }

    this.form.controls['service_attendance'].setValue(event ? 1 : 0);
  }

  onAddProviderControl(): void {
    const controls = <FormArray>this.form.controls['providers'];
    controls.controls.push(this.buildServiceProviderControl());
  }

  onAddAdminControl(): void {
    const controls = <FormArray>this.form.controls['admins'];
    controls.controls.push(this.buildAdminControl());
  }

  delteProviderControl(index): void {
    const controls = <FormArray>this.form.controls['providers'];
    controls.removeAt(index);
  }

  deleteAdminControl(index): void {
    const controls = <FormArray>this.form.controls['admins'];
    controls.removeAt(index);
  }

  buildServiceProviderControl() {
    return this.fb.group({
      'provider_name': [null],
      'email': [null],
      'custom_basic_feedback_label': [null]
    });
  }

  buildAdminControl() {
    return this.fb.group({
      'firstname': [null],
      'lastname': [null],
      'email': [null],
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
      'providers': this.fb.array([this.buildServiceProviderControl()]),
      'admins': this.fb.array([this.buildAdminControl()])
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
    console.log(this.form.controls['admins'].dirty);
    if (this.form.controls['admins'].dirty) {
      let adminControls = <FormArray>this.form.controls['admins'];
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
      .createService(
      {
        store_id: this.storeId,
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
      }
      )
      .switchMap(_ => {
        let providers = [];
        let search = new URLSearchParams();
        let controls = <FormArray>this.form.controls['providers'];
        let providersControls = controls.controls;

        providersControls.forEach((provider: FormGroup) => {
          providers.push({
            'provider_name': provider.controls['provider_name'].value,
            'email': provider.controls['email'].value,
            'custom_basic_feedback_label': provider.controls['custom_basic_feedback_label'].value
          });
        });

        search.append('service_id', this.serviceId.toString());
        return this.providersService.createProvider(providers, search);
      })
      .switchMap(_ => {
        let admins$ = [];
        let admins = <FormArray>this.form.controls['admins'];
        let adminsControls = admins.controls;

        adminsControls.forEach((admin: FormGroup) => {
          let _admin = {
            'firstname': admin.controls['firstname'].value,
            'lastname': admin.controls['lastname'].value,
            'email': admin.controls['email'].value,
            'account_level_privileges': {
              [this.storeId]: {
                [CP_PRIVILEGES_MAP.services]: {
                  r: true,
                  w: true
                }
              }
            }
          };
          admins$.push(this.adminService.createAdmin(_admin));
        });

        return Observable.combineLatest(admins$);
      })
      .catch(err => Observable.throw(err))
      .subscribe(
      res => console.log(res),
      err => console.log(err)
      );
  }

  ngOnInit() {
    this.storeId = 157;
    let categories = require('../categories.json');

    categories.map(category => {
      this.categories.push({
        label: category.name,
        action: category.id
      });
    });
  }
}
