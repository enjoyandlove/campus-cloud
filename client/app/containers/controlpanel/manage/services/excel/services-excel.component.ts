import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { isDev } from '../../../../../config/env';
import { CPSession } from '../../../../../session';
import { ServicesService } from '../services.service';
import { BaseComponent } from '../../../../../base/base.component';
import { CPI18nPipe } from './../../../../../shared/pipes/i18n/i18n.pipe';
import { CPImageUploadComponent } from '../../../../../shared/components';
import { SNACKBAR_SHOW } from './../../../../../reducers/snackbar.reducer';
import { CPI18nService, FileUploadService } from '../../../../../shared/services';
import { SERVICES_MODAL_RESET } from '../../../../../reducers/services-modal.reducer';
import { HEADER_DEFAULT, HEADER_UPDATE } from '../../../../../reducers/header.reducer';

const i18n = new CPI18nPipe();

@Component({
  selector: 'cp-services-excel',
  templateUrl: './services-excel.component.html',
  styleUrls: ['./services-excel.component.scss']
})
export class ServicesExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  stores;
  services;
  buttonData;
  categories;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  selectedCategory: string[] = [];
  isParentCheckBoxChecked = false;
  categoryDropDownStatus = true;
  uploadImageButtonClass = 'disabled';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store<any>,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private servicesService: ServicesService,
    private fileUploadService: FileUploadService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.store.select('SERVICES_MODAL').subscribe((res) => {
      this.services = !isDev ? res : require('./mock.json');
      this.buildForm();
      this.buildHeader();
    });
  }

  buildHeader() {
    const subheading = i18n.transform('services_import_items_to_import', this.services.length);

    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: {
        heading: 'services_imports_heading',
        crumbs: {
          url: 'services',
          label: 'services'
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: []
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      services: this.fb.array([])
    });

    this.loadCategories().then((res) => {
      this.categories = res;
      this.buildGroup();
    });

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: !this.form.valid
      });
    });
  }

  loadCategories(): Promise<any> {
    return this.servicesService
      .getCategories()
      .pipe(
        startWith([{ label: '---', action: null }]),
        map((categories: Array<any>) => {
          const _categories = [
            {
              label: '---',
              action: null
            }
          ];
          categories.map((category) => {
            _categories.push({
              action: category.id,
              label: category.name
            });
          });

          return _categories;
        })
      )
      .toPromise();
  }

  buildGroup() {
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
      school_id: [this.session.g.get('school').id],
      name: [service.service_name, Validators.required],
      description: [service.description],
      email: [service.service_email],
      contactphone: [service.phone_number],
      website: [service.website],
      category: [null, Validators.required],
      logo_url: [null, Validators.required]
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
          if (key === 'logo_url') {
            ctrl.controls[key].setValue(actions[key]);
          } else if (key === 'category') {
            this.selectedCategory[item.index] = actions[key];
            ctrl.controls[key].setValue(actions[key].action);
          }
        });
      }

      return item;
    });
  }

  onSingleCategorySelected(category, index) {
    const controls = <FormArray>this.form.controls['services'];
    const control = <FormGroup>controls.controls[index];

    control.controls['category'].setValue(category.action);
  }

  onSingleCheck(checked, index) {
    let _isChecked;

    _isChecked = this.isChecked.map((item) => {
      if (item.index === index) {
        item = Object.assign({}, item, { checked: checked });
      }

      return item;
    });

    const getOnlyChecked = _isChecked.filter((item) => item.checked);
    const isParentChecked = _isChecked.length === getOnlyChecked.length;
    const totalChecked = getOnlyChecked.length > 0;

    this.isChecked = [..._isChecked];
    this.updateTopHeaderButtonsStatus(totalChecked);
    this.updateParentCheckBoxStatus(isParentChecked);
  }

  onCheckAll(checked) {
    const _isChecked = [];

    this.isChecked.map((item) => {
      _isChecked.push(Object.assign({}, item, { checked: checked }));
    });

    this.isChecked = [..._isChecked];
    this.updateTopHeaderButtonsStatus(checked);
  }

  onCategoryBulkChange(category) {
    this.onBulkChange({ category });
  }

  onImageBulkChange(logo_url) {
    this.onBulkChange({ logo_url });
  }

  onSubmit() {
    this.servicesService
      .createService(this.form.value.services)
      .subscribe((_) => this.router.navigate(['/manage/services']), () => this.handleError());
  }

  handleError(err?: string) {
    this.store.dispatch({
      type: SNACKBAR_SHOW,
      payload: {
        class: 'danger',
        sticky: true,
        body: err ? err : this.cpI18n.translate('something_went_wrong')
      }
    });
  }

  onImageUpload(image: string, index: number) {
    const imageUpload = new CPImageUploadComponent(this.cpI18n, this.fileUploadService);
    const promise = imageUpload.onFileUpload(image, true);

    promise
      .then((res: any) => {
        const controls = <FormArray>this.form.controls['services'];
        const control = <FormGroup>controls.controls[index];
        control.controls['logo_url'].setValue(res.image_url);
      })
      .catch((err) => {
        this.handleError(err);
      });
  }

  onRemoveImage(index: number) {
    const eventControl = <FormArray>this.form.controls['services'];
    const control = <FormGroup>eventControl.at(index);
    control.controls['logo_url'].setValue(null);
  }

  resetAllCheckboxes(checked, index) {
    this.onCheckAll(false);
    this.onSingleCheck(checked, index);
  }

  updateTopHeaderButtonsStatus(checked) {
    this.categoryDropDownStatus = !checked;
    this.isParentCheckBoxChecked = checked;
    this.uploadImageButtonClass = checked ? 'cancel' : 'disabled';
  }

  updateParentCheckBoxStatus(checked) {
    this.isParentCheckBoxChecked = checked;
  }

  ngOnDestroy() {
    this.store.dispatch({ type: HEADER_DEFAULT });
    this.store.dispatch({ type: SERVICES_MODAL_RESET });
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('services_import_button')
    };
  }
}
