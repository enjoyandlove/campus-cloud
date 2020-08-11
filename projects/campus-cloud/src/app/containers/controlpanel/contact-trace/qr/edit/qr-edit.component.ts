import { Input, OnInit, Output, Component, ViewChild, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';

import { IService } from '@controlpanel/manage/services/service.interface';
import IServiceProvider from '@controlpanel/manage/services/providers.interface';
import { ProvidersService } from '@controlpanel/manage/services/providers.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import { ISnackbar, baseActionClass } from '@projects/campus-cloud/src/app/store';
import { CheckInMethod } from '../../../manage/events/event.status';

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
  form: FormGroup;
  lastCheckinState;

  eventProperties = {
    service_id: null,
    service_provider_id: null
  };

  constructor(
    public fb: FormBuilder,
    public cpI18n: CPI18nService,
    public utils: ServicesUtilsService,
    public providersService: ProvidersService,
    private store: Store<ISnackbar>
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
        this.showSuccessMessage();
      },
      () => {
        this.formErrors = true;
        this.enableSaveButton();
        this.showErrorMessage();
      }
    );
  }

  showSuccessMessage() {
    const isCodeChanged =
      this.provider.checkin_verification_methods.length === this.lastCheckinState.length
        ? false
        : true;
    if (isCodeChanged) {
      const message = this.provider.checkin_verification_methods.includes(CheckInMethod.app)
        ? this.cpI18n.translate('t_event_assessment_qr_code_enable_success_message')
        : this.cpI18n.translate('t_event_assessment_qr_code_disabled_success_message');

      this.store.dispatch(
        new baseActionClass.SnackbarSuccess({
          body: message
        })
      );
    } else {
      this.store.dispatch(
        new baseActionClass.SnackbarSuccess({
          body: this.cpI18n.translate('t_changes_saved_ok')
        })
      );
    }
  }

  showErrorMessage() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
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
    this.lastCheckinState = [...this.provider.checkin_verification_methods];
    this.form = this.utils.getQrProviderForm(this.provider);

    this.buttonData = {
      class: 'primary',
      disabled: false,
      text: this.cpI18n.translate('save')
    };
  }
}
