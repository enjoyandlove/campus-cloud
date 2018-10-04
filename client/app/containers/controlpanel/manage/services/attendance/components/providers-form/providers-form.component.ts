import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CheckInMethod } from '../../../../events/event.status';
import { CPI18nService } from '../../../../../../../shared/services';
import { ServicesUtilsService } from '../../../services.utils.service';
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
  attendanceFeedback;
  selectedAttendanceType;
  selectedAttendanceFeedback;

  constructor(
    public cpI18n: CPI18nService,
    public utils: EventUtilService,
    public serviceUtils: ServicesUtilsService
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

  onSelectedFeedback(hasFeedback: boolean): void {
    this.form.controls['has_feedback'].setValue(hasFeedback);

    const feedbackQuestion = !hasFeedback ? null
      : this.cpI18n.translate('t_events_default_feedback_question');

    this.form.controls['custom_basic_feedback_label'].setValue(feedbackQuestion);
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
    this.attendanceFeedback = this.serviceUtils.getAttendanceFeedback();

    this.selectedAttendanceType = this.getFromArray(
      this.attendanceTypes,
      'action',
      this.form.controls['has_checkout'].value);

    this.selectedAttendanceFeedback = this.getFromArray(
      this.attendanceFeedback,
      'action',
      this.form.controls['has_feedback'].value);

    this.selectedQrCode = this.getFromArray(
      this.serviceQRCodes,
      'action',
      this.getQRCodeStatus(this.form.controls['checkin_verification_methods'].value));
  }
}
