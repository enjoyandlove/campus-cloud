import { ActivatedRoute, Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import { LocationModel } from '../model';
import * as fromRoot from '../../../../../store';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { LocationsService } from '../locations.service';
import { CPI18nService } from './../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-locations-update',
  templateUrl: './locations-update.component.html',
  styleUrls: ['./locations-update.component.scss']
})
export class LocationsUpdateComponent extends BaseComponent implements OnInit {
  school;
  loading$;
  formErrors;
  buttonData;
  locationId;
  errorMessage;
  location: LocationModel;

  eventProperties = {
    acronym: null,
    location_id: null
  };

  constructor(
    public router: Router,
    private session: CPSession,
    public route: ActivatedRoute,
    public cpI18n: CPI18nService,
    public service: LocationsService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>,
  ) {
    super();
    this.locationId = this.route.snapshot.params['locationId'];
  }

  doSubmit() {
    this.formErrors = false;
    if (!this.location.form.valid) {
      this.formErrors = true;
      this.enableSubmitButton();

      return;
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

  public fetch() {
    const locationId = this.locationId;
    const school_id = this.session.g.get('school').id;
    const params = new HttpParams().append('school_id', school_id);

    const payload = {
      params,
      locationId
    };

    this.store.dispatch(new fromStore.GetLocationById(payload));
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

  ngOnInit() {
    this.fetch();
    this.setErrors();
    this.buildHeader();
    this.school = this.session.g.get('school');
    this.loading$ = this.store.select(fromStore.getLocationsLoading);
    this.store.select(fromStore.getLocations)
      .subscribe((location: LocationModel[]) => this.location = new LocationModel({...location}));

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('update')
    };
  }
}
