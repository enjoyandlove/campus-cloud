import { OnInit, Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';
import { PublicApiAccessTokenModel, IPublicApiAccessToken } from '../../model';
import { ApiManagementUtilsService } from '@controlpanel/api-management/api-management.utils.service';

@Mixin([Destroyable])
@Component({
  selector: 'cp-api-form',
  templateUrl: './api-management-form.component.html',
  styleUrls: ['./api-management-form.component.scss']
})
export class ApiManagementFormComponent implements OnInit, OnDestroy {
  buttonData;
  form: FormGroup;

  @Input() isEdit: boolean;
  @Input() formData: IPublicApiAccessToken;

  @Output() cancelEdit: EventEmitter<null> = new EventEmitter();
  @Output() valueChanges: EventEmitter<FormGroup> = new EventEmitter();
  @Output() submitted: EventEmitter<IPublicApiAccessToken> = new EventEmitter();

  formErrors = false;
  isSandbox: boolean;
  hasCampus: boolean;
  formValue: IPublicApiAccessToken;

  destroy$ = new Subject<null>();
  emitDestroy() {}

  constructor(public session: CPSession, private cpI18n: CPI18nService) {}

  onSave() {
    this.formErrors = false;
    if (this.form.invalid) {
      this.formErrors = true;
      this.enableSubmitButton();

      return;
    }

    this.formValue = ApiManagementUtilsService.parseFormValue(this.form);
    this.submitted.emit(this.formValue);
  }

  enableSubmitButton() {
    this.buttonData = {
      ...this.buttonData,
      disabled: false
    };
  }

  setCampusValueAndStatus(onInit?) {
    const permissionDataCtrl = this.form.get('permission_data') as FormGroup;
    const campus = permissionDataCtrl.get('campus').value;
    const audience = permissionDataCtrl.get('audience').value;
    const experience = permissionDataCtrl.get('experience').value;

    this.hasCampus = audience || experience;
    const campusValue = onInit ? this.hasCampus || campus : this.hasCampus;

    permissionDataCtrl.get('campus').setValue(campusValue);
  }

  ngOnInit() {
    const { is_sandbox, client_id } = this.session.g.get('school');

    this.form = PublicApiAccessTokenModel.form(this.formData);
    this.form.get('client_id').setValue(client_id);
    this.form.get('is_sandbox').setValue(is_sandbox);
    this.setCampusValueAndStatus(true);

    this.formValue = ApiManagementUtilsService.parseFormValue(this.form);
    this.isSandbox = is_sandbox;

    const buttonText = this.isEdit ? 'save' : 't_api_management_generate_key';

    this.buttonData = {
      text: this.cpI18n.translate(buttonText),
      class: 'primary'
    };

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.valueChanges.emit(this.form);
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
