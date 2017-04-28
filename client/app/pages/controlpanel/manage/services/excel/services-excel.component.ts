import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { isProd } from '../../../../../config/env';
import { ServicesService } from '../services.service';
import { StoreService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { HEADER_UPDATE, HEADER_DEFAULT } from '../../../../../reducers/header.reducer';

@Component({
  selector: 'cp-services-excel',
  templateUrl: './services-excel.component.html',
  styleUrls: ['./services-excel.component.scss']
})
export class ServicesExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  stores;
  services;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  eventAttendanceFeedback;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private storeService: StoreService,
    private servicesService: ServicesService
  ) {
    super();
    this
      .store
      .select('SERVICES_MODAL')
      .subscribe(
      (res) => {
        // this.services = res;
        this.services = isProd ? res : require('./mock.json');
        this.fetch();
      },
      err => console.log(err)
      );
  }

  private fetch() {
    super.isLoading().subscribe(res => this.loading = res);

    const stores$ = this.storeService.getStores().map(res => {
      const stores = [
        {
          'label': 'Host Name',
          'action': null
        }
      ];

      res.forEach(store => {
        stores.push({
          'label': store.name,
          'action': store.id
        });
      });

      return stores;
    });

    super
      .fetchData(stores$)
      .then(res => {
        this.buildForm();
        this.buildHeader();
        this.stores = res.data;
      })
      .catch(err => console.error(err));
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        'heading': 'Import Services from Excel',
        'em': `${this.services.length} student service(s) data information in the file`,
        'children': []
      }
    });
  }

  private buildForm() {
    this.form = this.fb.group({
      'services': this.fb.array([])
    });
    this.buildGroup();
  }

  private buildGroup() {
    const control = <FormArray>this.form.controls['services'];

    this.services.forEach((service, index) => {
      control.push(this.buildServiceControl(service));
      this.isChecked.push({ index, checked: false });
    });

    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['services'];
    control.removeAt(index);
  }

  buildServiceControl(service) {
    return this.fb.group({
      'store_id': [14748],
      'name': [service.service_name, Validators.required],
      'description': [service.description, Validators.required],
      'email': [service.service_email, Validators.required],
      'phone': [service.phone_number, Validators.required],
      'website': [service.website, Validators.required],
      'category': [null, Validators.required],
      'logo_url': [null, Validators.required],
    });
  }

  onBulkDelete() {
    let _isChecked = [];

    this.isChecked.reverse().forEach(item => {
      if (item.checked) {
        this.isChecked.slice(item.index, 1);
        this.removeControl(item.index);
        return;
      }
      item = Object.assign({}, item, { index: _isChecked.length });
      _isChecked.push(item);
    });

    this.isChecked = [..._isChecked];
  }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['services'];

    this.isChecked.map(item => {

      if (item.checked) {
        let ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach(key => {
          ctrl.controls[key].setValue(actions[key]);
        });
      }

      return item;
    });
  }

  onSingleCategorySelected(category, index) {
    const controls = <FormArray>this.form.controls['services'];
    const control = <FormGroup>controls.controls[index];

    control.controls['category'].setValue(category);
  }

  onSingleCheck(checked, index) {
    let _isChecked;

    _isChecked = this.isChecked.map(item => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }
      return item;
    });
    this.isChecked = [..._isChecked];
  }

  onCheckAll(checked) {
    let _isChecked = [];

    this.isChecked.map((item) => {
      _isChecked.push(Object.assign({}, item, { checked: checked }));
    });

    this.isChecked = [..._isChecked];
  }

  onCategoryBulkChange(category) {
    this.onBulkChange({ category });
  }

  onImageBulkChange(logo_url) {
    this.onBulkChange({ logo_url });
  }

  onSubmit() {
    let parsedServices = [];
    let _data = Object.assign({}, this.form.value.services);

    Object.keys(_data).forEach(key => {
      parsedServices.push(Object.assign({}, _data[key], { category: _data[key].category.action }));
    });

    this
      .servicesService
      .createService(parsedServices)
      .subscribe(
        _ => this.router.navigate(['/manage/services']),
        err => console.error(err)
      );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: HEADER_DEFAULT });
  }

  ngOnInit() {
  }
}
