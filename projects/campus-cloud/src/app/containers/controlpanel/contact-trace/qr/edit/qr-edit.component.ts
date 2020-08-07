import { Input, OnInit, Output, Component, ViewChild, EventEmitter } from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

import { IService } from '@controlpanel/manage/services/service.interface';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

declare var $: any;

@Component({
  selector: 'cp-qr-edit',
  templateUrl: './qr-edit.component.html',
  styleUrls: ['./qr-edit.component.scss']
})
export class QrEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm;

  @Input() service: IService;
  @Input() provider: IServiceProvider;

  @Output() edited: EventEmitter<any> = new EventEmitter();
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
    public fb: FormBuilder,
    public cpI18n: CPI18nService,
    public utils: ServicesUtilsService,
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

    this.providersService.updateProvider(this.form.value, this.provider.id, search).subscribe(
      (res) => {
        this.form.reset();
        this.resetModal();
        this.edited.emit(res);
      },
      () => {
        this.formErrors = true;
        this.enableSaveButton();
        this.errorMessage = this.cpI18n.translate('something_went_wrong');
      }
    );
  }

  enableSaveButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  resetModal() {
    this.teardown.emit();
    $('#editProvider').modal('hide');
  }

  ngOnInit() {
    this.form = this.utils.getQrProviderForm(this.provider);

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    };
  }
}
