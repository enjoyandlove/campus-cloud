import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { ServicesService } from '../services.service';
import { ServicesUtilsService } from '../services.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { IService } from '@controlpanel/manage/services/service.interface';
import { baseActionClass, baseActions, IHeader } from '@campus-cloud/store/base';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ServicesModel } from '@controlpanel/manage/services/model/services.model';
import { ServicesAmplitudeService } from '@controlpanel/manage/services/services.amplitude.service';

@Component({
  selector: 'cp-services-edit',
  templateUrl: './services-edit.component.html',
  styleUrls: ['./services-edit.component.scss']
})
export class ServicesEditComponent extends BaseComponent implements OnInit {
  loading;
  buttonData;
  form: FormGroup;
  formError = false;
  serviceId: number;
  addedImage = false;

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
    private fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private utils: ServicesUtilsService,
    private cpTracking: CPTrackingService,
    public servicesService: ServicesService,
    private store: Store<IHeader | ISnackbar>
  ) {
    super();
    super.isLoading().subscribe((res) => (this.loading = res));
    this.serviceId = this.route.snapshot.params['serviceId'];
  }

  private fetch() {
    super.fetchData(this.servicesService.getServiceById(this.serviceId)).then((res) => {
      this.form = ServicesModel.form(res.data);
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

    this.servicesService.updateService(this.form.value, this.serviceId).subscribe(
      (service: IService) => {
        const route = '/info';

        this.trackEvent(this.form.value);
        this.cpTracking.amplitudeEmitEvent(
          amplitudeEvents.MANAGE_UPDATED_ITEM,
          ServicesAmplitudeService.getItemProperties(service, this.addedImage)
        );
        this.router.navigate(['/manage/services/' + this.serviceId + route]);
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

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: baseActions.HEADER_UPDATE,
        payload: {
          heading: 'services_edit_heading',
          subheading: null,
          em: null,
          children: []
        }
      });
    });
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      ...this.utils.setEventProperties(data, this.serviceId)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_UPDATED_SERVICE,
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
    this.fetch();
    this.buildHeader();

    this.buttonData = {
      class: 'primary',
      text: this.cpI18n.translate('save')
    };
  }
}
