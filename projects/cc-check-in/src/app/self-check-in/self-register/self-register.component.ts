import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import ICheckIn from '@campus-cloud/containers/callback/checkin/checkin.interface';
import IAttendee from '@campus-cloud/containers/callback/checkin/components/attendee.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { IHeader } from '@campus-cloud/store';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';
import { emailAddress } from '@campus-cloud/shared/utils/forms';
import { environment } from '@projects/campus-cloud/src/environments/environment';
import { CheckInFormStatus } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.models';
import { SelfCheckInUtils } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-utils';
import { DeviceDetectorService } from '@projects/cc-check-in/src/app/self-check-in/services/device-detector.service';
import Any = jasmine.Any;

@Component({
  selector: 'check-self-register',
  templateUrl: './self-register.component.html',
  styleUrls: ['./self-register.component.scss']
})
export class SelfRegisterComponent implements OnInit {
  @Input() data: ICheckIn;
  @Input() isService: boolean;
  @Input() isSelfCheckIn = false;
  @Input() checkInFormStatus: CheckInFormStatus;

  @Output() send: EventEmitter<IAttendee> = new EventEmitter();
  @Output() redirect: EventEmitter<any> = new EventEmitter();

  envRootPath = environment.root;
  buttonData;
  datePickerOptions;
  verificationMethods;
  disabledQRCode = false;
  disableCheckInTooltip = '';
  registrationForm: FormGroup;
  @Input() clientConfig: any = {};
  disabledQRPath = environment.root + 'assets/app/disabledQR.png';

  constructor(private fb: FormBuilder,
              public deviceDetectorService: DeviceDetectorService,
              public store: Store<IHeader>,
              private cpI18n: CPI18nPipe) {}

  onSubmit(data) {
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

  ngOnInit() {
    this.verificationMethods = this.isService
      ? this.data['checkin_verification_methods']
      : this.data['attend_verification_methods'];

    this.registrationForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.pattern(emailAddress)])],
      firstname: [null, Validators.required],
      lastname: [null, Validators.required]
    });

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

  displayQR() {
    return SelfCheckInUtils.displayQR(this.checkInFormStatus);
  }

  displayForm() {
    return SelfCheckInUtils.displayForm(this.checkInFormStatus);
  }

  onlyDeepLinkByApp() {
    return SelfCheckInUtils.onlyDeepLinkByAppIsAvailable(this.checkInFormStatus);
  }

  redirectToApp($event: any) {
    this.redirect.emit($event);
  }
}
