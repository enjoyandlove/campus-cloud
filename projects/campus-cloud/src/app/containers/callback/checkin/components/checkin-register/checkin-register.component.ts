import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import IAttendee from '../attendee.interface';
import ICheckIn from '../../checkin.interface';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPI18nService } from '@campus-cloud/shared/services';
import { emailAddress } from '@campus-cloud/shared/utils/forms';
import { CheckInMethod } from '@campus-cloud/containers/controlpanel/manage/events/event.status';
import { baseActionClass, IHeader } from '@campus-cloud/store';
import { Store } from '@ngrx/store';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
};

@Component({
  selector: 'cp-checkin-register',
  templateUrl: './checkin-register.component.html',
  styleUrls: ['./checkin-register.component.scss']
})
export class CheckinRegisterComponent implements OnInit {
  @ViewChild('selectedDate', { static: true }) selectedDate;

  @Input() data: ICheckIn;
  @Input() timeZone: string;
  @Input() isService: boolean;

  @Output() send: EventEmitter<IAttendee> = new EventEmitter();

  buttonData;
  datePickerOptions;
  verificationMethods;
  disabledQRCode = false;
  disableCheckInTooltip = '';
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder,
              public store: Store<IHeader>,
              private cpI18n: CPI18nPipe) {}

  onSubmit(data) {
    this.datePickerOptions = {
      defaultDate: Date.now()
    };
    this.registrationForm.reset({
      check_in_time_epoch: Math.round(CPDate.now(this.timeZone).unix())
    });
    this.send.emit(data);
  }

  disableManualCheckIn() {
    const disabled = !this.verificationMethods.includes(CheckInMethod.web);

    if (disabled) {
      this.disableCheckInTooltip = this.cpI18n.transform(
        't_external_check_in_disable_manual_check_in'
      );

      return disabled;
    }
  }

  setCheckin(date) {
    if (date) {
      this.registrationForm.controls['check_in_time_epoch'].setValue(
        CPDate.toEpoch(date, this.timeZone)
      );
    }
  }

  ngOnInit() {
    this.verificationMethods = this.isService
      ? this.data['checkin_verification_methods']
      : this.data['attend_verification_methods'];

    this.registrationForm = this.fb.group({
      check_in_time_epoch: [Math.round(CPDate.now(this.timeZone).unix())],
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailAddress)])],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required]
    });

    this.datePickerOptions = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: Date.now()
    };

    this.buttonData = {
      disabled: true,
      text: this.cpI18n.transform('confirm'),
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
  }

  notifyCopySuccess() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.transform('contact_trace_forms_copied_clipboard')
      })
    );
  }
}
