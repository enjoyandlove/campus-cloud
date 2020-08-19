import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, startWith, take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as locationStore from '../store';

import { CPSession } from '@campus-cloud/session';
import { EnvService } from '@campus-cloud/config/env';
import { CPI18nPipe } from '@campus-cloud/shared/pipes/i18n/i18n.pipe';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { CPI18nService } from '@campus-cloud/shared/services';
import { baseActions, baseActionClass, getLocationsModalState } from '@campus-cloud/store/base';
import { LocationsService } from '../locations.service';
import { CategoriesService } from '../categories/categories.service';
@Mixin([Destroyable])
@Component({
  selector: 'cp-locations-excel',
  templateUrl: './locations-excel.component.html',
  styleUrls: ['./locations-excel.component.scss']
})
export class LocationsExcelComponent extends BaseComponent implements OnInit, OnDestroy {
  locations;
  buttonData;
  categories;
  isChecked = [];
  loading = false;
  form: FormGroup;
  isFormReady = false;
  selectedCategory: string[] = [];
  isParentCheckBoxChecked = false;
  categoryDropDownStatus = true;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private env: EnvService,
    private store: Store<any>,
    private session: CPSession,
    private i18nPipe: CPI18nPipe,
    private cpI18n: CPI18nService,
    private locationService: LocationsService,
    private categoriesService: CategoriesService
  ) {
    super();
    super
      .isLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.loading = res));

    this.store
      .select(getLocationsModalState)
      .pipe(take(1))
      .subscribe((res) => {
        this.locations = this.env.name !== 'development' ? res : require('./mock.json');
        this.buildForm();
        this.buildHeader();
      });
  }

  buildHeader() {
    const subheading = this.i18nPipe.transform(
      'locations_import_items_to_import',
      this.locations.length
    );

    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'import_locations',
        crumbs: {
          url: 'locations',
          label: 'locations'
        },
        em: `[NOTRANSLATE]${subheading}[NOTRANSLATE]`,
        children: []
      }
    });
  }

  buildForm() {
    this.form = this.fb.group({
      locations: this.fb.array([])
    });

    this.loadCategories().then((res) => {
      this.categories = res;
      this.buildGroup();
    });
  }

  loadCategories(): Promise<any> {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    return this.categoriesService
      .getCategories(search)
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
    const control = <FormArray>this.form.controls['locations'];

    this.locations.forEach((location, index) => {
      control.push(this.buildLocationControl(location));
      this.isChecked.push({ index, checked: false });
    });

    this.isFormReady = true;
  }

  removeControl(index) {
    const control = <FormArray>this.form.controls['locations'];
    control.removeAt(index);
  }

  buildLocationControl(location) {
    const current_category = this.categories.filter((el) => el.label == location.category_name);

    this.selectedCategory.push(current_category[0]);

    return this.fb.group({
      name: [location.name, Validators.required],
      category_id: [current_category[0].action, Validators.required],
      short_name: [location.acronym],
      address: [location.address],
      description: [location.description],
      phone: [location.phone],
      email: [location.email],
      latitude: [location.latitude, Validators.required],
      longitude: [location.longitude, Validators.required]
    });
  }

  onBulkChange(actions) {
    const control = <FormArray>this.form.controls['locations'];
    this.isChecked.map((item) => {
      if (item.checked) {
        const ctrl = <FormGroup>control.controls[item.index];

        Object.keys(actions).forEach((key) => {
          if (key === 'category') {
            this.selectedCategory[item.index] = actions[key];
            ctrl.controls['category_id'].setValue(actions[key].action);
          }
        });
      }
    });
    this.enableSubmitButton();
  }

  onSingleCategorySelected(category, index) {
    const controls = <FormArray>this.form.controls['locations'];
    const control = <FormGroup>controls.controls[index];

    control.controls['category_id'].setValue(category.action);

    this.enableSubmitButton();
  }

  enableSubmitButton() {
    let isValid = false;

    if (this.isChecked.length > 0) {
      isValid = this.form.controls.locations['controls'].reduce((prev, item, index) => {
        let valid = true;
        if (this.isChecked[index].checked) {
          valid = item.status === 'VALID' ? true : false;
        }
        return valid && prev;
      }, true);
    }

    this.buttonData = Object.assign({}, this.buttonData, {
      disabled: !isValid
    });
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

    this.enableSubmitButton();
  }

  onCheckAll(checked) {
    const _isChecked = [];

    this.isChecked.map((item) => {
      _isChecked.push(Object.assign({}, item, { checked: checked }));
    });

    this.isChecked = [..._isChecked];
    this.updateTopHeaderButtonsStatus(checked);

    this.enableSubmitButton();
  }

  onCategoryBulkChange(category) {
    this.onBulkChange({ category });
  }

  onSubmit() {
    const params = new HttpParams().set('school_id', this.session.g.get('school').id);

    const data = this.form.value.locations.filter((item, i) => {
      return this.isChecked.some((el) => el.checked && el.index === i);
    });

    this.store.dispatch(new locationStore.ImportLocations(''));

    this.locationService
      .createLocation(data, params)
      .subscribe((_) => this.router.navigate(['/manage/locations']), () => this.handleError());
  }

  handleError(err?: string) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: err ? err : this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  resetAllCheckboxes(checked, index) {
    this.onCheckAll(false);
    this.onSingleCheck(checked, index);
  }

  updateTopHeaderButtonsStatus(checked) {
    this.categoryDropDownStatus = !checked;
    this.isParentCheckBoxChecked = checked;
  }

  updateParentCheckBoxStatus(checked) {
    this.isParentCheckBoxChecked = checked;
  }

  ngOnDestroy() {
    this.emitDestroy();
    this.store.dispatch({ type: baseActions.HEADER_DEFAULT });
    this.store.dispatch({ type: baseActions.SERVICES_MODAL_RESET });
  }

  ngOnInit() {
    this.buttonData = {
      disabled: true,
      class: 'primary',
      text: this.cpI18n.translate('import_locations')
    };
  }
}
