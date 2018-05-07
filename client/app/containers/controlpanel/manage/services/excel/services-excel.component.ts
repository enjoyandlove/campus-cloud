import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { isDev } from '../../../../../config/env';
import { CPSession } from '../../../../../session';
import { ServicesService } from '../services.service';
import { CPI18nService } from '../../../../../shared/services';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nPipe } from './../../../../../shared/pipes/i18n/i18n.pipe';
import { SERVICES_MODAL_RESET } from '../../../../../reducers/services-modal.reducer';

import {
  HEADER_UPDATE,
  HEADER_DEFAULT,
} from '../../../../../reducers/header.reducer';

const i18n = new CPI18nPipe();

@Component({
  selector: 'cp-services-excel',
  templateUrl: './services-excel.component.html',
  styleUrls: ['./services-excel.component.scss'],
})
export class ServicesExcelComponent extends BaseComponent
  implements OnInit, OnDestroy {
  stores;
  services;
  buttonData;
  categories;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  eventAttendanceFeedback;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private servicesService: ServicesService,
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.store.select('SERVICES_MODAL').subscribe((res) => {
      // this.services = res;
      this.services = !isDev ? res : require('./mock.json');
      this.buildForm();
      this.buildHeader();
    });
  }

  buildHeader() {
    const subheading = i18n.transform(
      'services_import_items_to_import',
      this.services.length,
    );

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'services_imports_heading',
        crumbs: {
          url: 'services',
          label: 'services',
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: [],
      },
    });
  }

  buildForm() {
    this.form = this.fb.group({
      services: this.fb.array([]),
    });
    this.buildGroup();

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid,
      });
    });
  }

  loadCategories(): Promise<any> {
    return this.servicesService
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
      })
      .toPromise();
  }

  buildGroup() {
    const control = <FormArray>this.form.controls['services'];

    this.services.forEach((service, index) => {
      control.push(this.buildServiceControl(service));
      this.isChecked.push({ index, checked: false });
    });

    this.loadCategories().then((res) => {
      this.categories = res;
      this.isFormReady = true;
    });
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['services'];
    control.removeAt(index);
  }

  buildServiceControl(service) {
    return this.fb.group({
      school_id: [this.session.g.get('school').id],
      name: [service.service_name, Validators.required],
      description: [service.description],
      email: [service.service_email],
      contactphone: [service.phone_number],
      website: [service.website],
      category: [null, Validators.required],
      logo_url: [null, Validators.required],
    });
  }

  // onBulkDelete() {
  //   let _isChecked = [];

  //   this.isChecked.reverse().forEach(item => {
  //     if (item.checked) {
  //       this.isChecked.slice(item.index, 1);
  //       this.removeControl(item.index);
  //       return;
  //     }
  //     item = Object.assign({}, item, { index: _isChecked.length });
  //     _isChecked.push(item);
  //   });

  //   this.isChecked = [..._isChecked];
  // }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['services'];

    this.isChecked.map((item) => {
      if (item.checked) {
        const ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach((key) => {
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

    _isChecked = this.isChecked.map((item) => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }

      return item;
    });
    this.isChecked = [..._isChecked];
  }

  onCheckAll(checked) {
    const _isChecked = [];

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
    const parsedServices = [];
    const _data = Object.assign({}, this.form.value.services);

    Object.keys(_data).forEach((key) => {
      parsedServices.push(
        Object.assign({}, _data[key], { category: _data[key].category.action }),
      );
    });

    this.servicesService.createService(parsedServices).subscribe(
      (_) => this.router.navigate(['/manage/services']),
      (err) => {
        throw new Error(err);
      },
    );
  }

  ngOnDestroy() {
    this.store.dispatch({ type: HEADER_DEFAULT });
    this.store.dispatch({ type: SERVICES_MODAL_RESET });
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('services_import_button'),
    };
  }
}
