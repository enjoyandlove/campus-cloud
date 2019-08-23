import { OnInit, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { IItem } from '@campus-cloud/shared/components';
import { baseActions } from '@campus-cloud/store/base';
import { CPSession, ISchool } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { LatLngValidators } from '@campus-cloud/shared/validators';
import { DiningModel } from '@campus-cloud/libs/locations/common/model';
import { map, takeUntil, tap } from 'rxjs/operators';
import { ICategory } from '@campus-cloud/libs/locations/common/categories/model';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import * as fromCategoryStore from '@controlpanel/manage/dining/categories/store';

@Component({
  selector: 'cp-dining-create',
  templateUrl: './dining-create.component.html',
  styleUrls: ['./dining-create.component.scss']
})
export class DiningCreateComponent implements OnInit, OnDestroy, AfterViewInit {
  school: ISchool;
  formErrors: boolean;
  openingHours = true;
  errorMessage: string;
  diningForm: FormGroup;
  buttonDisabled = false;
  categories$: Observable<IItem[]>;

  private destroy$ = new Subject();

  constructor(
    public router: Router,
    public session: CPSession,
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
      body
    };

    this.store.dispatch(new fromStore.PostDining(payload));
  }

  buildHeader() {
    const payload = {
      heading: 't_dining_create_dining',
      subheading: null,
      em: null,
      children: []
    };

    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload
    });
  }

  onCancel() {
    this.store.dispatch(new fromStore.ResetError());
    this.router.navigate(['/manage/dining']);
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

  loadCategories() {
    const categoryLabel = this.cpI18n.translate('select_category');
    this.categories$ = this.store.select(fromCategoryStore.getCategories).pipe(
      takeUntil(this.destroy$),
      tap((categories: ICategory[]) => {
        if (!categories.length) {
          this.store.dispatch(new fromCategoryStore.GetCategories());
        }
      }),
      map((categories) => LocationsUtilsService.setCategoriesDropDown(categories, categoryLabel))
    );
  }

  ngOnInit() {
    this.buildHeader();
    this.loadCategories();
    this.school = this.session.g.get('school');

    this.diningForm = DiningModel.form();
    LocationsUtilsService.setScheduleFormControls(this.diningForm);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    const lat = this.diningForm.get('latitude');
    const lng = this.diningForm.get('longitude');

    lat.setValue(this.school.latitude);
    lng.setValue(this.school.longitude);

    lat.setAsyncValidators([this.latLng.validateLatitude(lng)]);
    lng.setAsyncValidators([this.latLng.validateLongitude(lat)]);
  }
}
