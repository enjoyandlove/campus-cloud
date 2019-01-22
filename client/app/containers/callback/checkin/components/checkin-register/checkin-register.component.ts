import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPDate } from '@shared/utils';
import IAttendee from '../attendee.interface';
import ICheckIn from '../../checkin.interface';
import { CPI18nService } from '@shared/services';
import { CheckInMethod } from '@containers/controlpanel/manage/events/event.status';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
};

@Component({
  selector: 'cp-checkin-register',
  templateUrl: './checkin-register.component.html',
  styleUrls: ['./checkin-register.component.scss']
})
export class CheckinRegisterComponent implements OnInit {
  @ViewChild('selectedDate') selectedDate;

  @Input() data: ICheckIn;
  @Input() timeZone: string;
  @Input() isService: boolean;

  @Output() send: EventEmitter<IAttendee> = new EventEmitter();

  buttonData;
  placeholder;
  datePickerOptions;
  verificationMethods;
  disabledQRCode = false;
  disableCheckInTooltip = '';
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private cpI18n: CPI18nService) {}

  onSubmit(data) {
    if (!data.check_in_time_epoch) {
      data.check_in_time_epoch = Math.round(CPDate.now(this.timeZone).unix());
    }

    this.selectedDate.clearDate();
    this.registrationForm.reset();
    this.send.emit(data);
  }

  disableManualCheckIn() {
    const disabled = !this.verificationMethods.includes(CheckInMethod.web);

    if (disabled) {
      $(function() {
        $('[data-toggle="tooltip"]').tooltip();
      });

      this.disableCheckInTooltip = this.cpI18n.translate(
        't_external_check_in_disable_manual_check_in'
      );

      return disabled;
    }
  }

  setCheckin(date) {
    this.registrationForm.controls['check_in_time_epoch'].setValue(
      CPDate.toEpoch(date, this.timeZone)
    );
  }

  ngOnInit() {
    this.verificationMethods = this.isService
      ? this.data['checkin_verification_methods']
      : this.data['attend_verification_methods'];

    this.registrationForm = this.fb.group({
      check_in_time_epoch: [null],
      email: [null, Validators.required],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required]
    });

    this.datePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS
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

    this.disabledQRCode = !this.verificationMethods.includes(CheckInMethod.app);
    this.placeholder = this.cpI18n.translate('t_check_in_date_placeholder_text');
  }
}
