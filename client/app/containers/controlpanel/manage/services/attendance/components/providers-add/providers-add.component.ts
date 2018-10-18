import { Input, OnInit, Output, Component, ViewChild, EventEmitter } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { FormGroup } from '@angular/forms';

import { Feedback } from '../../../services.status';
import { IService } from '../../../service.interface';
import { ProvidersService } from '../../../providers.service';
import { ServicesUtilsService } from '../../../services.utils.service';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-providers-add',
  templateUrl: './providers-add.component.html',
  styleUrls: ['./providers-add.component.scss']
})
export class ServicesProviderAddComponent implements OnInit {
  @ViewChild('createForm') createForm;

  @Input() service: IService;

  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formErrors;
  buttonData;
  errorMessage;
  form: FormGroup;

  eventProperties = {
    feedback: null,
    service_id: null,
    service_provider_id: null
  };

  constructor(
    public cpI18n: CPI18nService,
    public utils: ServicesUtilsService,
    public cpTracking: CPTrackingService,
    public providersService: ProvidersService
  ) {}

  onSubmit() {
    this.formErrors = false;

    if (!this.form.valid) {
      this.formErrors = true;
      this.enableSaveButton();

      return;
    }

    const search = new HttpParams().append('service_id', this.service.id.toString());

    this.providersService.createProvider(this.form.value, search).subscribe(
      (res) => {
        this.trackEvent(res);
        this.form.reset();
        $('#createProvider').modal('hide');
        this.created.emit(res);
      },
      (_) => {
        this.formErrors = true;
        this.enableSaveButton();
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      service_id: this.service.id,
      service_provider_id: data.id,
      feedback: this.getFeedbackStatus(data.custom_basic_feedback_label)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_SERVICE_PROVIDER,
      this.eventProperties
    );
  }

  getFeedbackStatus(val) {
    return val ? Feedback.enabled : Feedback.disabled;
  }

  resetModal() {
    this.teardown.emit();
    $('#createProvider').modal('hide');
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  ngOnInit() {
    this.form = this.utils.getProviderForm(null);

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    };
  }
}
