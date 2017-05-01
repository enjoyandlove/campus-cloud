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
import { IServiceDeleteModal } from './components/service-edit-delete-modal';
import { IHeader, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

declare var $: any;

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
  deletedItem: IServiceDeleteModal = {
    id: null,
    name: null,
    type: null,
    index: null
  };

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
    let searchProviders = new URLSearchParams();
    let searchAdmin = new URLSearchParams();
    searchAdmin.append('school_id', '157');
    searchProviders.append('service_id', this.serviceId.toString());

    const service$ = this.servicesService.getServiceById(this.serviceId);
    const providers$ = this.providersService.getProviders(1, 1000, searchProviders);
    const admins$ = this.adminService.getAdmins(1, 1000, searchAdmin);

    const stream$ = Observable.combineLatest(service$, providers$, admins$);
    super
      .fetchData(stream$)
      .then(res => {
        let admins = res.data[2];

        let providers = res.data[1];

        this.service = res.data[0];
        this.mapCenter = { lat: res.data[0].latitude, lng: res.data[0].longitude };

        this.storeId = res.data[0].store_id;

        this.buildForm();

        if (admins.length) {
          let control = <FormArray>this.form.controls['admins'];
          admins.forEach(admin => control.push(this.buildAdminControl(admin)));
        }

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

  onProviderCreated(provider) {
    const controls = <FormArray>this.form.controls['providers'];
    controls.push(this.buildServiceProviderControl(provider));
  }

  onAdminCreated(admin) {
    const controls = <FormArray>this.form.controls['admins'];
    controls.push(this.buildAdminControl(admin));
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

  deleteAdmin(data: IServiceDeleteModal) {
    const controls = <FormArray>this.form.controls['admins'];
    let _data = {
      'account_level_privileges': [
        {
          [this.storeId]: {
            [CP_PRIVILEGES_MAP.services]: {
              r: false,
              w: false
            }
          }
        }
      ]
    };

    this
      .adminService
      .updateAdmin(data.id, _data)
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
    if (event.type === 'admin') {
      this.deleteAdmin(event);
      return;
    }
  }

  deleteAdminControl(index): void {
    const controls = <FormArray>this.form.controls['admins'];
    const control = <FormGroup>controls.at(index);

    this.deletedItem = {
      index: index,
      type: 'admin',
      id: control.controls['id'].value,
      name: `${control.controls['firstname'].value} ${control.controls['lastname'].value}`,
    };

    $('#serviceEditDeleteModal').modal();
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

  buildAdminControl(admin?: any) {
    if (admin) {
      return this.fb.group({
        'id': [admin.id],
        'firstname': [admin.firstname],
        'lastname': [admin.lastname],
        'email': [admin.email],
      });
    }
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
      'providers': this.fb.array([]),
      'admins': this.fb.array([])
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
    console.log('updating service');

    this
      .servicesService
      .updateService(
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
      },
      this.serviceId
      )
      .switchMap(_ => {
        console.log('updating provider');
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
      .switchMap(_ => {
        console.log('updating admins');
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
          admins$.push(this.adminService.updateAdmin(admin.controls['id'].value, _admin));
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
    let categories = require('../categories.json');

    categories.map(category => {
      this.categories.push({
        label: category.name,
        action: category.id
      });
    });
  }
}
