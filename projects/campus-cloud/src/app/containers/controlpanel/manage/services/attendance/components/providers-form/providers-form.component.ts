import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IMultiSelectItem } from '@campus-cloud/shared/components';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CPI18nService } from '@campus-cloud/shared/services';
import { ServicesUtilsService } from '@controlpanel/manage/services/services.utils.service';
import {
  CheckInMethod,
  SelfCheckInOption
} from '@controlpanel/manage/events/event.status';

@Component({
  selector: 'cp-providers-form',
  templateUrl: './providers-form.component.html',
  styleUrls: ['./providers-form.component.scss']
})
export class ServicesProvidersFormComponent implements OnInit {
  @Input() formErrors;
  @Input() form: FormGroup;

  selfCheckInMethods: IMultiSelectItem[];
  selectedQrCode;
  attendanceTypes;
  attendanceFeedback;
  selectedAttendanceType;
  selectedAttendanceFeedback;

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

  onSelectedFeedback(hasFeedback: boolean): void {
    this.form.controls['has_feedback'].setValue(hasFeedback);

    const feedbackQuestion = !hasFeedback
      ? null
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
    this.selfCheckInMethods = this.utils.getSelfCheckInMethods();
    this.attendanceTypes = this.utils.getAttendanceTypeOptions();
    this.attendanceFeedback = this.serviceUtils.getAttendanceFeedback();

    this.selectedAttendanceType = this.getFromArray(
      this.attendanceTypes,
      'action',
      this.form.controls['has_checkout'].value
    );

    this.selectedAttendanceFeedback = this.getFromArray(
      this.attendanceFeedback,
      'action',
      this.form.controls['has_feedback'].value
    );


    this.setSelfCheckInMethods(this.form.controls['checkin_verification_methods'].value);
  }

  onSelectedCheckInMethods(options: number[]) {
    this.form.controls['checkin_verification_methods'].setValue([CheckInMethod.web]);
    const verificationMethods = this.form.controls['checkin_verification_methods'].value;

    options.forEach(option => {
      if (option === SelfCheckInOption.qr && !verificationMethods.includes(CheckInMethod.app)) {
        verificationMethods.push(CheckInMethod.app);
      } else if (option === SelfCheckInOption.email && !verificationMethods.includes(CheckInMethod.userWebEntry)) {
        verificationMethods.push(CheckInMethod.userWebEntry);
      } else if (option === SelfCheckInOption.appLink && !verificationMethods.includes(CheckInMethod.deepLink)) {
        verificationMethods.push(CheckInMethod.deepLink);
      }
    });
  }

  private setSelfCheckInMethods(attend_verification_methods) {
    if (!attend_verification_methods) {
      return;
    }
    this.selfCheckInMethods = this.utils.getSelfCheckInMethods()
      .map((option) => {
        return {
          ...option,
          selected: EventUtilService.getSelfCheckInStatus(attend_verification_methods, option.action)
        };
      });
  }
}

