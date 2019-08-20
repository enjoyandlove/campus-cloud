import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { ServicesService } from '../services.service';
import { EnvService } from '@campus-cloud/config/env';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { CPI18nService, ImageService } from '@campus-cloud/shared/services';
import { baseActions, getServicesModalState, baseActionClass } from '@campus-cloud/store/base';

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
    private env: EnvService,
    private store: Store<any>,
    private session: CPSession,
    private i18nPipe: CPI18nPipe,
    private cpI18n: CPI18nService,
    private imageService: ImageService,
    private servicesService: ServicesService
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));

    this.store.select(getServicesModalState).subscribe((res) => {
      this.services = this.env.name !== 'development' ? res : require('./mock.json');
      this.buildForm();
      this.buildHeader();
    });
  }

  buildHeader() {
    const subheading = this.i18nPipe.transform(
      'services_import_items_to_import',
      this.services.length
    );

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
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
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: err ? err : this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  onImageUpload(image: File, index: number) {
    const promise = this.imageService.upload(image).toPromise();

    promise
      .then((res: any) => {
        const controls = <FormArray>this.form.controls['services'];
        const control = <FormGroup>controls.controls[index];
        control.controls['logo_url'].setValue(res.image_url);
      })
      .catch((err) => {
        this.handleError(err.message);
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
    this.store.dispatch({ type: baseActions.HEADER_DEFAULT });
    this.store.dispatch({ type: baseActions.SERVICES_MODAL_RESET });
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('services_import_button')
    };
  }
}
