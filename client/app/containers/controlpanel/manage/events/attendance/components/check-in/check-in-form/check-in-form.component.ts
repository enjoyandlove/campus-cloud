import { Component, Input, OnInit } from '@angular/core';

import { CPSession } from '../../../../../../../../session';
import { CPDate } from '../../../../../../../../shared/utils';

const COMMON_DATE_PICKER_OPTIONS = {
  utc: true,
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

const NO_CHECKOUT_DATE = -1;

@Component({
  selector: 'cp-event-attendance-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss']
})
export class CheckInFormComponent implements OnInit {
  @Input() form;
  @Input() event;
  @Input() formErrors;

  disableEmailOnEdit;
  checkInDatePickerOptions;
  checkOutDatePickerOptions;

  constructor(public session: CPSession) {}

  ngOnInit() {
    const _self = this;
    const check_in_time = this.form.controls['check_in_time'].value;
    const check_out_time = this.form.controls['check_out_time_epoch'].value;

    this.disableEmailOnEdit = this.form.controls['email'].value;

    this.checkInDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: check_in_time
        ? CPDate.fromEpoch(check_in_time, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['check_in_time'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.checkOutDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: check_out_time !== NO_CHECKOUT_DATE
        ? CPDate.fromEpoch(check_out_time, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['check_out_time_epoch']
          .setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };
  }
}
