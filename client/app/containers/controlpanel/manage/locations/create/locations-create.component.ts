import { OnInit, Component, OnDestroy } from '@angular/core';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { LocationModel } from '../model';
import { baseActions } from '@app/store/base';
import { CPSession, ISchool } from '@app/session';
import { CPI18nService } from '@app/shared/services';
import { LocationsService } from '../locations.service';
import * as fromCategoryStore from '../categories/store';
import { LocationsUtilsService } from '../locations.utils';
import { ICategory, ICategoryDropDown } from '../categories/categories.interface';

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit, OnDestroy {
  school: ISchool;
  formErrors: boolean;
  openingHours = true;
  errorMessage: string;
  buttonDisabled = false;
  locationForm: FormGroup;
  categories$: Observable<ICategoryDropDown[]>;

  private destroy$ = new Subject();

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: LocationsService,
    public store: Store<fromStore.ILocationsState | fromCategoryStore.ICategoriesState | fromRoot.IHeader>
  ) {}

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

    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      body,
      params
    };

    this.store.dispatch(new fromStore.PostLocation(payload));
  }

  buildHeader() {
    const payload = {
      heading: 't_locations_create_location',
      subheading: null,
      em: null,
      children: []
    };

    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload
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
      map((res) => LocationsUtilsService.setCategories(res))
    );
  }

  ngOnInit() {
    this.setErrors();
    this.buildHeader();
    this.loadCategories();
    this.school = this.session.g.get('school');

    this.locationForm = LocationModel.form();
    LocationsUtilsService.setScheduleFormControls(this.locationForm);
    this.locationForm.get('latitude').setValue(this.school.latitude);
    this.locationForm.get('longitude').setValue(this.school.longitude);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
