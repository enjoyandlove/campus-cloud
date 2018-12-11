import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { LocationModel } from '../model';
import * as fromRoot from '@app/store';
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
  location: LocationModel;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: LocationsService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>
  ) {}

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

    this.location = new LocationModel();
    this.location.form.get('latitude').setValue(this.school.latitude);
    this.location.form.get('longitude').setValue(this.school.longitude);

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
