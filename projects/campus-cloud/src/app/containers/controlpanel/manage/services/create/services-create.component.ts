import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { IService } from '../service.interface';
import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { ServicesService } from '../services.service';
import { ServicesUtilsService } from '../services.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store/base';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ServicesModel } from '@controlpanel/manage/services/model/services.model';
import { ServicesAmplitudeService } from '@controlpanel/manage/services/services.amplitude.service';

@Component({
  selector: 'cp-services-create',
  templateUrl: './services-create.component.html',
  styleUrls: ['./services-create.component.scss']
})
export class ServicesCreateComponent implements OnInit {
  buttonData;
  form: FormGroup;
  formError = false;

  eventProperties = {
    phone: null,
    email: null,
    website: null,
    location: null,
    service_id: null,
    assessment: null,
    category_name: null
  };

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: ServicesUtilsService,
    public cpTracking: CPTrackingService,
    public servicesService: ServicesService,
    public store: Store<IHeader | ISnackbar>
  ) {}

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: 'services_create_heading',
        subheading: null,
        em: null,
        children: []
      }
    });
  }

  onSubmit() {
    this.formError = false;

    if (this.form.invalid) {
      this.formError = true;
      this.enableSaveButton();
      this.handleError(this.cpI18n.translate('error_fill_out_marked_fields'));

      return;
    }

    const data = this.form.value;
    data['school_id'] = this.session.g.get('school').id;

    this.servicesService.createService(data).subscribe(
      (service: IService) => {
        const url = service.service_attendance ? '/info' : '';

        this.trackEvent(service, service.id);
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_CREATED_ITEM,
          ServicesAmplitudeService.getItemProperties(service)
        );
        this.router.navigate(['/manage/services/' + service.id + url]);
      },
      () => {
        this.enableSaveButton();
        this.handleError(this.cpI18n.translate('something_went_wrong'));
      }
    );
  }

  handleError(body) {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body
      })
    );
  }

  trackEvent(data, serviceId) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data, serviceId)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_SERVICE,
      this.eventProperties
    );
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  onSelectProperties(properties) {
    this.eventProperties = {
      ...this.eventProperties,
      ...properties
    };
  }

  ngOnInit() {
    this.buildHeader();

    this.form = ServicesModel.form();

    this.buttonData = {
      disabled: false,
      class: 'primary',
      text: this.cpI18n.translate('services_create_button_create')
    };
  }
}
