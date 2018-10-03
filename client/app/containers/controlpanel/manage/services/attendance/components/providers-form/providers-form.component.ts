import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CheckInMethod } from '../../../../events/event.status';
import { CPI18nService } from '../../../../../../../shared/services';
import { EventUtilService } from '../../../../events/events.utils.service';

@Component({
  selector: 'cp-providers-form',
  templateUrl: './providers-form.component.html',
  styleUrls: ['./providers-form.component.scss']
})
export class ServicesProvidersFormComponent implements OnInit {
  @Input() form: FormGroup;

  formErrors;
  serviceQRCodes;
  attendanceTypes;
  selectedQrCode;
  selectedAttendanceType;
  serviceAcceptsFeedback;

  constructor(
    public fb: FormBuilder,
    public cpI18n: CPI18nService,
    public utils: EventUtilService
  ) {}

  showErrors(errors) {
    this.formErrors = errors;
  }

  getQRCodeStatus(qrCodes) {
    return qrCodes.includes(CheckInMethod.app);
  }

  onSelectedAttendanceType(hasCheckout: boolean): void {
    this.form.controls['has_checkout'].setValue(hasCheckout);
  }

  getFromArray(arr: Array<any>, key: string, val: string) {
    return arr.filter((item) => item[key] === val)[0];
  }

  onSelectedQRCode(isEnabled: boolean): void {
    const verificationMethods = this.form.controls['checkin_verification_methods'].value;

    if (isEnabled && !verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.push(CheckInMethod.app);
    } else if (!isEnabled && verificationMethods.includes(CheckInMethod.app)) {
      verificationMethods.pop(CheckInMethod.app);
    }
  }

  ngOnInit() {
    this.serviceQRCodes = this.utils.getQROptions();
    this.attendanceTypes = this.utils.getAttendanceTypeOptions();

    this.selectedAttendanceType = this.getFromArray(
      this.attendanceTypes,
      'action',
      this.form.controls['has_checkout'].value);

    this.selectedQrCode = this.getFromArray(
      this.serviceQRCodes,
      'action',
      this.getQRCodeStatus(this.form.controls['checkin_verification_methods'].value));
  }
}
