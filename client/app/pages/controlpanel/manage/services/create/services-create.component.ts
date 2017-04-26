import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { ProvidersService } from '../providers.service';
import { CP_PRIVILEGES_MAP } from '../../../../../shared/utils/privileges';
import { AdminService } from '../../../../../shared/services/admin.service';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {
  mapCenter;
  storeId: number;
  form: FormGroup;
  createdServiceId;
  formError = false;
  attendance = false;
  categories = [{ label: '---', action: null }];

  constructor(
    private fb: FormBuilder,
    private store: Store<IHeader>,
    private adminService: AdminService,
    private servicesService: ServicesService,
    private providersService: ProvidersService
  ) {
    this.buildHeader();
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
      .switchMap(service => {
        this.createdServiceId = service.id;

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

        search.append('service_id', this.createdServiceId);
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

  ngOnInit() {
    this.storeId = 14748;
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
      'phone': [null],
      'secondary_name': [null],
      'city': [null],
      'province': [null],
      'country': [null],
      'postal_code': [null],
      'latitude': [null],
      'longitude': [null],
      'service_attendance': [null],
      'rating_scale_maximum': [null],
      'default_basic_feedback_label': [null],
      'providers': this.fb.array([this.buildServiceProviderControl()]),
      'admins': this.fb.array([this.buildAdminControl()])
    });

    let categories = require('../categories.json');

    categories.map(category => {
      this.categories.push({
        label: category.name,
        action: category.id
      });
    });
  }
}
