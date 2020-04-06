import { OnInit, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { IItem } from '@campus-cloud/shared/components';
import { baseActions } from '@campus-cloud/store/base';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPI18nService } from '@campus-cloud/shared/services';
import { LatLngValidators } from '@campus-cloud/shared/validators';
import * as fromCategoryStore from '../categories/store';
import { ICategory } from '@campus-cloud/libs/locations/common/categories/model';
import { DiningModel, IDining } from '@campus-cloud/libs/locations/common/model';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';

@Mixin([Destroyable])
@Component({
  selector: 'cp-dining-edit',
  templateUrl: './dining-edit.component.html',
  styleUrls: ['./dining-edit.component.scss']
})
export class DiningEditComponent implements OnInit, OnDestroy, Destroyable, AfterViewInit {
  diningId: number;
  categoryId: number;
  formErrors: boolean;
  openingHours = true;
  errorMessage: string;
  diningForm: FormGroup;
  buttonDisabled = false;
  selectedCategory: IItem;
  loading$: Observable<boolean>;
  categories$: Observable<IItem[]>;
  updatedCategory = amplitudeEvents.NO;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(
    public router: Router,
    public cpI18n: CPI18nService,
    public latLng: LatLngValidators,
    public store: Store<fromStore.IDiningState | fromRoot.IHeader>
  ) {}

  doSubmit() {
    this.formErrors = false;
    this.buttonDisabled = true;

    if (this.diningForm.invalid) {
      this.formErrors = true;
      this.buttonDisabled = false;

      this.handleWarning();

      return;
    }

    const body = this.diningForm.value;
    body['schedule'] = LocationsUtilsService.filteredScheduleControls(
      this.diningForm,
      this.openingHours
    );

    const payload = {
      body,
      diningId: this.diningId,
      categoryId: this.categoryId,
      updatedCategory: this.updatedCategory
    };

    this.store.dispatch(new fromStore.EditDining(payload));
  }

  buildHeader() {
    const payload = {
      heading: 't_dining_edit_dining',
      subheading: null,
      em: null,
      children: []
    };

    Promise.resolve().then(() => {
      this.store.dispatch({
        type: fromRoot.baseActions.HEADER_UPDATE,
        payload
      });
    });
  }

  loadDining() {
    this.store
      .select(fromStore.getSelectedDining)
      .pipe(
        takeUntil(this.destroy$),
        filter((dining: IDining) => !!dining),
        map((dining: IDining) => {
          const schedule = dining['schedule'];
          this.openingHours = !!schedule.length;
          this.diningId = dining.id;
          this.categoryId = dining.category_id;
          this.diningForm = DiningModel.form(dining);
          LocationsUtilsService.setScheduleFormControls(this.diningForm, schedule);
        })
      )
      .subscribe();
  }

  loadCategories() {
    const categoryLabel = this.cpI18n.translate('select_category');
    this.categories$ = this.store.select(fromCategoryStore.getCategories).pipe(
      takeUntil(this.destroy$),
      tap((categories: ICategory[]) => {
        if (!categories.length) {
          this.store.dispatch(new fromCategoryStore.GetCategories());
        }
      }),
      map((categories) => LocationsUtilsService.setCategoriesDropDown(categories, categoryLabel)),
      map((parsedCategories) => {
        Promise.resolve().then(() => {
          this.selectedCategory = parsedCategories.find((c) => c.action === this.categoryId);
        });

        return parsedCategories;
      })
    );
  }

  onCancel() {
    this.store.dispatch(new fromStore.ResetError());
    this.router.navigate([`/manage/dining/${this.diningId}/info`]);
  }

  handleWarning() {
    const options = {
      class: 'warning',
      body: this.cpI18n.translate('error_fill_out_marked_fields')
    };

    this.dispatchSnackBar(options);
  }

  dispatchSnackBar(options) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        ...options,
        sticky: true,
        autoClose: true
      }
    });
  }

  onChangeCategory() {
    this.updatedCategory = amplitudeEvents.YES;
  }

  ngOnInit() {
    this.loadDining();
    this.buildHeader();
    this.loadCategories();

    this.loading$ = this.store.select(fromStore.getDiningLoading);
  }

  ngOnDestroy() {
    this.emitDestroy();
  }

  ngAfterViewInit() {
    const lat = this.diningForm.get('latitude');
    const lng = this.diningForm.get('longitude');

    lat.setAsyncValidators([this.latLng.validateLatitude(lng)]);
    lng.setAsyncValidators([this.latLng.validateLongitude(lat)]);
  }
}
