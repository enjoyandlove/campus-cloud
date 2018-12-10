import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { LocationModel } from '../model';
import * as fromRoot from '../../../../../store';
import { LocationsService } from '../locations.service';
import { CPSession, ISchool } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';
import { FormArray } from '@angular/forms';

@Component({
  selector: 'cp-locations-create',
  templateUrl: './locations-create.component.html',
  styleUrls: ['./locations-create.component.scss']
})
export class LocationsCreateComponent implements OnInit {
  formErrors;
  buttonData;
  errorMessage;
  school: ISchool;
  openingHours = true;
  location: LocationModel;

  eventProperties = {
    acronym: null,
    location_id: null
  };

  constructor(
    private session: CPSession,
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

  onToggleOpeningHours(isOpen) {
    this.openingHours = isOpen;

    if (!isOpen) {
      const schedule = <FormArray>this.location.form.controls['schedule'];
      while (schedule.length !== 0) {
        schedule.removeAt(0);
      }
    }
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
