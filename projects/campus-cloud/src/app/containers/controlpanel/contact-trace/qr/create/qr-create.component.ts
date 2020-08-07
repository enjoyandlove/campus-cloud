import { Input, OnInit, Output, Component, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { amplitudeEvents } from '@campus-cloud/shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import { IService } from '@controlpanel/manage/services/service.interface';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { HttpParams } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'cp-qr-create',
  templateUrl: './qr-create.component.html',
  styleUrls: ['./qr-create.component.scss']
})
export class QrCreateComponent implements OnInit {
  @ViewChild('createForm', { static: true }) createForm;

  @Input() service: IService;

  @Output() created: EventEmitter<any> = new EventEmitter();
  @Output() teardown: EventEmitter<null> = new EventEmitter();

  formErrors;
  buttonData;
  errorMessage;
  form: FormGroup;

  eventProperties = {
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
      service_id: this.service.id.toString(),
      service_provider_id: data.id
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CREATED_SERVICE_PROVIDER,
      this.eventProperties
    );
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
    this.form = this.utils.getQrProviderForm(null);

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    };
  }
}
