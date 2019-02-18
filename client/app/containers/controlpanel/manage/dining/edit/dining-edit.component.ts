import { OnInit, Component, OnDestroy, AfterViewInit } from '@angular/core';
import { filter, map, takeUntil, tap } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { baseActions } from '@app/store/base';
import { CPI18nService } from '@app/shared/services';
import { LatLngValidators } from '@shared/validators';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { IDining, LocationModel } from '@libs/locations/common/model';

@Component({
  selector: 'cp-dining-edit',
  templateUrl: './dining-edit.component.html',
  styleUrls: ['./dining-edit.component.scss']
})
export class DiningEditComponent implements OnInit, OnDestroy, AfterViewInit {
  diningId: number;
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
    public store: Store<
      fromStore.IDiningState | fromRoot.IHeader
      >
  ) {}

  doSubmit() {
    this.formErrors = false;
    this.buttonDisabled = true;

    if (!this.diningForm.valid) {
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

    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      body,
      params,
      diningId: this.diningId
    };

    this.store.dispatch(new fromStore.EditDining(payload));
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

  loadDining() {
    this.store.select(fromStore.getSelectedDining).pipe(
      takeUntil(this.destroy$),
      filter((dining: IDining) => !! dining),
      map((dining: IDining) => {
        const schedule = dining['schedule'];
        this.openingHours = !!schedule.length;
        this.diningId = dining.id;
        this.diningForm = LocationModel.form(dining);
        LocationsUtilsService.setScheduleFormControls(this.diningForm, schedule);

        this.diningForm.addControl('notes', new FormControl(dining.notes));
      })
    ).subscribe();
  }

  setErrors() {
    this.store
      .select(fromStore.getDiningError)
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
    this.router.navigate([`/manage/dining/${this.diningId}/info`]);
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

  ngOnInit() {
    this.setErrors();
    this.loadDining();
    this.buildHeader();

    // todo replace with actual
    this.categories$ = of([
      {
        label: 'Select Category',
        action: null
      },
      {
        label: 'Dining',
        action: 8
      }
    ]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  ngAfterViewInit() {
    const lat = this.diningForm.get('latitude');
    const lng = this.diningForm.get('longitude');

    lat.setAsyncValidators([this.latLng.validateLatitude(lng)]);
    lng.setAsyncValidators([this.latLng.validateLongitude(lat)]);
  }
}
