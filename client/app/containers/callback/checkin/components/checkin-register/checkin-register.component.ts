import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import IAttendee from '../attendee.interface';
import ICheckIn from '../../checkin.interface';
import { CPSession } from '../../../../../session';
import { CPDate } from '../../../../../shared/utils';
import { CPI18nService } from '../../../../../shared/services';
import { CheckInMethod } from '../../../../controlpanel/manage/events/event.status';

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
  @Input() data: ICheckIn;
  @Input() isService: boolean;

  @Output() send: EventEmitter<IAttendee> = new EventEmitter();

  buttonData;
  placeholder;
  datePickerOptions;
  disabledQRCode = false;
  disableCheckInTooltip = '';
  registrationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private session: CPSession,
    private cpI18n: CPI18nService
  ) {}

  onSubmit(data) {
    if (!data.check_in_time_epoch) {
      data.check_in_time_epoch = Math.round(CPDate.now(this.session.tz).unix());
    }

    this.registrationForm.reset();
    this.send.emit(data);
  }

  disableManualCheckIn() {
    // todo temporary remove when service check-in done
    if (this.isService) {
      return;
    }

    const disabled = !this.data.attend_verification_methods.includes(CheckInMethod.web);

    if (disabled) {
      $(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });

      this.disableCheckInTooltip = this.cpI18n.
      translate('t_external_check_in_disable_manual_check_in');

      return disabled;
    }
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

    this.buttonData = {
      disabled: true,
      text: this.cpI18n.translate('confirm'),
      class: 'primary cpbtn--full-width cpbtn--tall'
    };

    const isDisabledManualCheckIn = this.disableManualCheckIn();

    this.registrationForm.valueChanges.subscribe(() => {
      this.buttonData = {
        ...this.buttonData,
        disabled: !this.registrationForm.valid || isDisabledManualCheckIn
      };
    });

    this.placeholder = this.cpI18n.translate('t_check_in_date_placeholder_text');
    this.disabledQRCode = !this.data.attend_verification_methods.includes(CheckInMethod.app);
  }
}
