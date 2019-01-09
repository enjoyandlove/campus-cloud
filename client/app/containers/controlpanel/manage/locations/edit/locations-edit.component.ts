import { OnInit, Component, OnDestroy } from '@angular/core';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { BaseComponent } from '@app/base';
import { IItem } from '@shared/components';
import { baseActions } from '@app/store/base';
import { CPSession, ISchool } from '@app/session';
import { LocationModel, ILocation } from '../model';
import { CPI18nService } from '@app/shared/services';
import * as fromCategoryStore from '../categories/store';
import { LocationsUtilsService } from '../locations.utils';
import { ICategory } from '../categories/categories.interface';

@Component({
  selector: 'cp-locations-edit',
  templateUrl: './locations-edit.component.html',
  styleUrls: ['./locations-edit.component.scss']
})
export class LocationsEditComponent extends BaseComponent implements OnInit, OnDestroy {
  school: ISchool;
  formErrors: boolean;
  locationId: number;
  categoryId: number;
  errorMessage: string;
  openingHours = false;
  buttonDisabled = false;
  locationForm: FormGroup;
  selectedCategory: IItem;
  loading$: Observable<boolean>;
  categories$: Observable<IItem[]>;

  private destroy$ = new Subject();

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.ILocationsState | fromCategoryStore.ICategoriesState | fromRoot.IHeader>,
  ) {
    super();
  }

  doSubmit() {
    this.formErrors = false;
    this.buttonDisabled = true;

    if (!this.locationForm.valid) {
      this.formErrors = true;
      this.buttonDisabled = false;

      this.handleWarning();

      return;
    }

    const body = this.locationForm.value;
    body['schedule'] = LocationsUtilsService.filteredScheduleControls(this.locationForm, this.openingHours);

    const locationId = this.locationId;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      body,
      params,
      locationId
    };

    this.store.dispatch(new fromStore.EditLocation(payload));
  }

  buildHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: `t_locations_edit_location`,
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  setErrors() {
    this.store.select(fromStore.getLocationsError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          this.formErrors = true;
          this.buttonDisabled = false;
          const errorMessage = this.cpI18n.translate('something_went_wrong');

          this.handleError(errorMessage);
        })
      )
      .subscribe();
  }

  onCancel() {
    this.store.dispatch(new fromStore.ResetError());
    this.router.navigate(['/manage/locations']);
  }

  handleError(body) {
    const options = {
      body,
      class: 'danger'
    };
    this.dispatchSnackBar(options);
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

  loadLocation() {
    this.store.select(fromStore.getSelectedLocation).pipe(
      takeUntil(this.destroy$),
      filter((location: ILocation) => !! location),
      map((location: ILocation) => {
        const schedule = location['schedule'];
        this.openingHours = !!schedule.length;
        this.locationId = location.id;
        this.categoryId = location.category_id;
        this.locationForm = LocationModel.form(location);
        LocationsUtilsService.setScheduleFormControls(this.locationForm, schedule);
      })
    ).subscribe();
  }

  loadCategories() {
    this.categories$ = this.store.select(fromCategoryStore.getCategories).pipe(
      takeUntil(this.destroy$),
      tap((categories: ICategory[]) => {
        if (!categories.length) {
          const params = new HttpParams()
            .set('school_id', this.session.g.get('school').id);

          this.store.dispatch(new fromCategoryStore.GetCategories({ params }));
        }
      }),
      map((categories) => LocationsUtilsService.setCategoriesDropDown(categories)),
      map(parsedCategories => {
        Promise.resolve().then(() => {
          this.selectedCategory = parsedCategories.find((c) => c.action === this.categoryId);
        });

        return parsedCategories;
      })
    );
  }

  ngOnInit() {
    this.setErrors();
    this.buildHeader();
    this.loadLocation();
    this.loadCategories();
    this.school = this.session.g.get('school');
    this.loading$ = this.store.select(fromStore.getLocationsLoading);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
