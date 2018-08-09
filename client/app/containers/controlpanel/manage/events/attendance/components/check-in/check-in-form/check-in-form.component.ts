import { Component, Input, OnInit } from '@angular/core';

import { CPSession } from '../../../../../../../../session';
import { CPDate } from '../../../../../../../../shared/utils';

const COMMON_DATE_PICKER_OPTIONS = {
  utc: true,
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-event-attendance-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss']
})
export class CheckInFormComponent implements OnInit {
  @Input() form;
  @Input() formErrors;

  checkInDatePickerOptions;
  checkOutDatePickerOptions;

  constructor(public session: CPSession) {}

  ngOnInit() {
    const _self = this;
    const check_in_time = this.form.controls['check_in_time'].value;
    const check_out_time = this.form.controls['check_out_time'].value;

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
      defaultDate: check_out_time
        ? CPDate.fromEpoch(check_out_time, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['check_out_time'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };
  }
}
