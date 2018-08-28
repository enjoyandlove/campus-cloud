import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import IEvent from '../../../../event.interface';
import { CheckInOutTime } from '../../../../event.status';
import { CPSession } from '../../../../../../../../session';
import { CPDate } from '../../../../../../../../shared/utils';

const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: 'F j, Y h:i K'
};

@Component({
  selector: 'cp-check-in-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CheckInFormComponent implements OnInit {
  @Input() event: IEvent;
  @Input() isEdit = false;
  @Input() form: FormGroup;
  @Input() formErrors: string;

  checkInDatePickerOptions;
  checkOutDatePickerOptions;

  constructor(public session: CPSession) {}

  ngOnInit() {
    const _self = this;
    const checkInTime = this.form.controls['check_in_time'].value;
    const checkOutTime = this.form.controls['check_out_time_epoch'].value;

    this.checkInDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: checkInTime
        ? CPDate.fromEpoch(checkInTime, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['check_in_time'].setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };

    this.checkOutDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: checkOutTime !== CheckInOutTime.empty
        ? CPDate.fromEpoch(checkOutTime, _self.session.tz).format()
        : null,
      onChange: function(_, dataStr) {
        _self.form.controls['check_out_time_epoch']
          .setValue(CPDate.toEpoch(dataStr, _self.session.tz));
      }
    };
  }
}
