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

import { ServiceFeedback } from '../../../services.status';
import IServiceProvider from '../../../providers.interface';
import { ProvidersService } from '../../../providers.service';
import { EventUtilService } from '../../../../events/events.utils.service';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-providers-edit',
  templateUrl: './providers-edit.component.html',
  styleUrls: ['./providers-edit.component.scss']
})
export class ServiceProvidersEditComponent implements OnInit {
  @ViewChild('editForm') editForm;

  @Input() service;
  @Input() provider: IServiceProvider;

  @Output() edited: EventEmitter<any> = new EventEmitter();
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
      this.editForm.showErrors(this.form);

      this.buttonData = {
        ...this.buttonData,
        disabled: false
      };

      return;
    }

    const search = new HttpParams().append('service_id', this.service.id.toString());

    this.providersService.createProvider(this.form.value, search).subscribe((res) => {
      this.form.reset();
      $('#editProvider').modal('hide');
      this.edited.emit(res);
    });
  }

  resetModal() {
    this.teardown.emit();
    $('#editProvider').modal('hide');
  }

  ngOnInit() {
    this.form = this.fb.group({
      email: [this.provider.email, Validators.required],
      has_checkout: [this.provider.has_checkout],
      provider_name: [this.provider.provider_name, Validators.required],
      checkin_verification_methods: [this.provider.checkin_verification_methods],
      custom_basic_feedback_label: [this.provider.custom_basic_feedback_label, Validators.required]
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
