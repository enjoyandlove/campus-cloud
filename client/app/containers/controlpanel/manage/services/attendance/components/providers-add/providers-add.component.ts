import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Feedback } from '../../../services.status';
import { ProvidersService } from '../../../providers.service';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';

declare var $: any;

@Component({
  selector: 'cp-providers-add',
  templateUrl: './providers-add.component.html',
  styleUrls: ['./providers-add.component.scss']
})
export class ServicesProviderAddComponent implements OnInit {
  @Input() serviceId: number;
  @Input() serviceWithFeedback: Observable<boolean>;
  @Output() created: EventEmitter<any> = new EventEmitter();

  formErrors;
  form: FormGroup;
  serviceAcceptsFeedback;

  eventProperties = {
    feedback: null,
    service_id: null,
    service_provider_id: null
  };

  constructor(
    private fb: FormBuilder,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService,
    private providersService: ProvidersService
  ) {}

  onSubmit() {
    const search = new HttpParams().append('service_id', this.serviceId.toString());

    this.providersService.createProvider(this.form.value, search).subscribe((res) => {
      this.trackEvent(res);
      this.form.reset();
      $('#createProvider').modal('hide');
      this.created.emit(res);
    });
  }

  doReset() {
    this.form.reset();
    this.formErrors = false;
  }

  trackEvent(data) {
    this.eventProperties = {
      ...this.eventProperties,
      service_id: this.serviceId,
      service_provider_id: data.id,
      feedback: this.getFeedback(data.custom_basic_feedback_label)
    };

    this.cpTracking.amplitudeEmitEvent(
     amplitudeEvents.MANAGE_CREATED_SERVICE_PROVIDER,
     this.eventProperties);
  }

  getFeedback(val) {
    return val ? Feedback.enabled : Feedback.disabled;
  }

  ngOnInit() {
    this.serviceWithFeedback.subscribe((feedback) => {
      this.serviceAcceptsFeedback = feedback;

      this.form = this.fb.group({
        provider_name: [null, Validators.required],
        email: [null, Validators.required],
        custom_basic_feedback_label: [null, Validators.required]
      });

      if (!this.serviceAcceptsFeedback) {
        this.form.controls['custom_basic_feedback_label'].setValue(
          this.cpI18n.translate('services_default_feedback_question')
        );
      }
    });
  }
}
