import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import { CPMap } from '../../../../../shared/utils';
import { ServicesService } from '../services.service';
import { ProvidersService } from '../providers.service';
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
    let data = Object.assign(this.form.value);
    this.formError = false;
    console.log(this.form.value);

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
        let providers = this.form.controls['providers'].value;

        providers = providers.map(provider => {
          provider.controls['service_id'].setValue(this.createdServiceId);
        });

        return this.providersService.createProvider(providers);
      })
      .switchMap(_ => {
        let admins$;
        let admins = this.form.controls['admins'].value;

        admins = admins.map(admin => {
          admin.controls['account_level_privileges'].setValue({
            [this.createdServiceId]: {
              '24': {
                r: true,
                w: true
              }
            }
            });
          });
        admins.forEach(admin => admins$.push(this.adminService.createAdmin(admin)));

        return Observable.combineLatest(admins$);
      })
      .catch(err => Observable.throw(err))
      .subscribe(
        res => console.log(res),
        err => console.log(err)
      );

  // if (!this.form.valid) {
  //   this.formError = true;
  //   return;
  // }
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

onAddAdminControl() : void {
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
    'service_id': [null, Validators.required],
    'provider_name': [null, Validators.required],
    'email': [null, Validators.required],
    'custom_basic_feedback_label': [null]
  });
}

buildAdminControl() {
  return this.fb.group({
    'firstname': [null, Validators.required],
    'lastname': [null, Validators.required],
    'email': [null, Validators.required],
    'account_level_privileges': [null]
  });
}

ngOnInit() {
  this.storeId = 157;
  this.form = this.fb.group({
    'name': [null, Validators.required],
    'logo_url': [null, Validators.required],
    'category': [null, Validators.required],
    'store_id': [null, Validators.required],
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
