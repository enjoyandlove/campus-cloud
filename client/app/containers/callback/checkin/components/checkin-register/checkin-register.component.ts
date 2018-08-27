import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from '../../../../../session';
import { CPDate } from '../../../../../shared/utils';
import { CheckInOutTime } from '../../../callback.status';

const FORMAT_WITH_TIME = 'F j, Y h:i K';

const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: FORMAT_WITH_TIME
};

@Component({
  selector: 'cp-checkin-register',
  templateUrl: './checkin-register.component.html',
  styleUrls: ['./checkin-register.component.scss']
})
export class CheckinRegisterComponent implements OnInit {
  @Input() data: any;
  @Output() send: EventEmitter<any> = new EventEmitter();

  datePickerOptions;
  placeholder = 'Now';
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private session: CPSession) {}

  onSubmit(data) {
    if (!data.check_in_time_epoch) {
      data.check_in_time_epoch = Math.round(CPDate.now(this.session.tz).unix());
    }

    data = {
      ...data,
      check_in_type: 'web',
      check_out_time_epoch: CheckInOutTime.empty
    };

    this.send.emit(data);
    this.registrationForm.reset();
  }

  ngOnInit() {
    this.registrationForm = this.fb.group({
      check_in_time_epoch: [null],
      email: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required]
    });

    const _self = this;
    this.datePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      onChange: function(_, dateStr) {
        _self.registrationForm.controls['check_in_time_epoch']
          .setValue(CPDate.toEpoch(dateStr, _self.session.tz));
      }
    };
  }
}
