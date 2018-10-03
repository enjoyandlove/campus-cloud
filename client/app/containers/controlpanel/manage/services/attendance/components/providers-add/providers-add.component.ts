import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ProvidersService } from '../../../providers.service';
import { Feedback, ServiceFeedback } from '../../../services.status';
import { EventUtilService } from '../../../../events/events.utils.service';
import { attendanceType, CheckInMethod } from '../../../../events/event.status';
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

  @Input() service;

  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  errors;
  buttonData;
  form: FormGroup;
  serviceAcceptsFeedback;

  eventProperties = {
    feedback: null,
    service_id: null,
    service_provider_id: null
  };

  constructor(
    private el: ElementRef,
    public fb: FormBuilder,
    public cpI18n: CPI18nService,
    public utils: EventUtilService,
    public cpTracking: CPTrackingService,
    public providersService: ProvidersService
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  onSubmit() {
    this.errors = false;

    if (!this.form.valid) {
      this.createForm.showErrors(this.form);

      this.buttonData = {
        ...this.buttonData,
        disabled: false
      };

      return;
    }

    const search = new HttpParams().append('service_id', this.service.id.toString());

    this.providersService.createProvider(this.form.value, search).subscribe((res) => {
      this.trackEvent(res);
      this.form.reset();
      $('#createProvider').modal('hide');
      this.created.emit(res);
    });
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

  ngOnInit() {
    this.form = this.fb.group({
      email: [null, Validators.required],
      has_checkout: [attendanceType.checkInOnly],
      provider_name: [null, Validators.required],
      custom_basic_feedback_label: [null, Validators.required],
      checkin_verification_methods: [[CheckInMethod.web, CheckInMethod.webQr, CheckInMethod.app]]
    });

    this.serviceAcceptsFeedback = this.service.enable_feedback === ServiceFeedback.enabled;

    if (!this.serviceAcceptsFeedback) {
      this.form.controls['custom_basic_feedback_label'].setValue(
        this.cpI18n.translate('services_default_feedback_question')
      );
    }

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    };
  }
}
