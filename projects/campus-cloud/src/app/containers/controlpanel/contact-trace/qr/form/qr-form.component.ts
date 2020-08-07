import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CPI18nService } from '@campus-cloud/shared/services';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';

@Component({
  selector: 'cp-qr-form',
  templateUrl: './qr-form.component.html',
  styleUrls: ['./qr-form.component.scss']
})
export class QrFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formErrors;

  serviceQRCodes;
  selectedQrCode;
  attendanceTypes;
  selectedAttendanceType;

  constructor(
    public cpI18n: CPI18nService,
    public utils: EventUtilService,
    public serviceUtils: ServicesUtilsService
  ) {}

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
      this.form.controls['has_checkout'].value
    );

    this.selectedQrCode = this.getFromArray(
      this.serviceQRCodes,
      'action',
      this.getQRCodeStatus(this.form.controls['checkin_verification_methods'].value)
    );
  }
}
