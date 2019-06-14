import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import IEvent from '../../../event.interface';
import { CheckInOutTime } from '../../../event.status';
import { CPSession } from '../../../../../../../session';
import { CPDate } from '../../../../../../../shared/utils';
import IServiceProvider from '../../../../services/providers.interface';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
};

@Component({
  selector: 'cp-check-in-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class CheckInFormComponent implements OnInit {
  @Input() isEdit = false;
  @Input() form: FormGroup;
  @Input() formErrors: string;
  @Input() data: IEvent | IServiceProvider;

  checkInDatePickerOptions;
  checkOutDatePickerOptions;

  constructor(public session: CPSession) {}

  setCheckin(date) {
    this.form.controls['check_in_time'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  setCheckout(date) {
    this.form.controls['check_out_time_epoch'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  ngOnInit() {
    const _self = this;
    const checkInTime = this.form.controls['check_in_time'].value;
    const checkOutTime = this.form.controls['check_out_time_epoch'].value;

    this.checkInDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: checkInTime
        ? CPDate.fromEpochLocal(checkInTime, _self.session.tz).format()
        : null
    };

    this.checkOutDatePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate:
        checkOutTime !== CheckInOutTime.empty
          ? CPDate.fromEpochLocal(checkOutTime, _self.session.tz).format()
          : null
    };
  }
}
