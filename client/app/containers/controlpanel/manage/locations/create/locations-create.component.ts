import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { LocationModel } from '../model';
import { baseActions } from '@app/store/base';
import { CPSession, ISchool } from '@app/session';
import { CPI18nService } from '@app/shared/services';
import { LocationsService } from '../locations.service';

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit {
  formState;
  formErrors;
  buttonData;
  errorMessage;
  school: ISchool;
  openingHours = true;
  buttonDisabled = false;
  location: LocationModel;

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: LocationsService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>
  ) {}

  doSubmit() {
    this.formErrors = false;
    this.buttonDisabled = true;

    if (!this.location.form.valid) {
      this.formErrors = true;
      this.buttonDisabled = false;

      this.handleError();

      return;
    }

    if (!this.openingHours) {
      this.location.form.setControl('schedule', new FormControl([]));
    }

    const body = this.location.form.value;
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
      .subscribe((isError: boolean) => {
        if (isError) {
          this.formErrors = true;
          this.buttonDisabled = false;
          const errorMessage = this.cpI18n.translate('something_went_wrong');

          this.handleError(errorMessage);
        }
      });
  }

  onChangeFormState(formState) {
    this.formState = formState;
  }

  onCancel() {
    this.router.navigate(['/manage/locations']);
  }

  handleError(err?: string) {
    this.store.dispatch({
      type: baseActions.SNACKBAR_SHOW,
      payload: {
        sticky: true,
        class: 'danger',
        autoClose: true,
        body: err ? err : this.cpI18n.translate('error_fill_out_marked_fields')
      }
    });
  }

  ngOnInit() {
    this.setErrors();
    this.buildHeader();
    this.school = this.session.g.get('school');

    this.location = new LocationModel();
    this.location.form.get('latitude').setValue(this.school.latitude);
    this.location.form.get('longitude').setValue(this.school.longitude);
  }
}
