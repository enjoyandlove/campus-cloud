import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { LocationModel } from '../model';
import { CPSession } from '@app/session';
import { BaseComponent } from '@app/base';
import { CPI18nService } from '@app/shared/services';

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss']
})
export class LocationsUpdateComponent extends BaseComponent implements OnInit {
  school;
  schedule;
  loading$;
  formState;
  formErrors;
  buttonData;
  locationId;
  errorMessage;
  openingHours = false;
  location: LocationModel;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>,
  ) {
    super();
  }

  doSubmit() {
    this.formErrors = false;
    if (!this.location.form.valid) {
      this.formErrors = true;
      this.enableSubmitButton();

      return;
    }

    if (!this.openingHours) {
      this.location.form.setControl('schedule', new FormControl([]));
    }

    const body = this.location.form.value;
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

  enableSubmitButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  setErrors() {
    this.store.select(fromStore.getLocationsError)
      .subscribe((isError: boolean) => {
        if (isError) {
          this.formErrors = true;
          this.enableSubmitButton();
          this.errorMessage = this.cpI18n.translate('something_went_wrong');
        }
      });
  }

  onChangeFormState(formState) {
    this.formState = formState;
  }

  ngOnInit() {
    this.setErrors();
    this.buildHeader();
    this.school = this.session.g.get('school');
    this.loading$ = this.store.select(fromStore.getLocationsLoading);
    this.store.select(fromStore.getSelectedLocation)
      .subscribe((location: LocationModel) => {
        if (location) {
          this.locationId = location.id;
          this.schedule = location['schedule'];
          this.openingHours = !!this.schedule;
          this.location = new LocationModel({...location});
        }
      });

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('update')
    };
  }
}
