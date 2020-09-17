import { Component, Input, OnInit } from '@angular/core';
import { CheckInFormStatus } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.models';
import { environment } from '@projects/cc-check-in/src/environments/environment';
import { SelfCheckInUtils } from '@projects/cc-check-in/src/app/self-check-in/services/self-check-in-utils';

@Component({
  selector: 'check-self-check-in-feedback',
  templateUrl: './self-check-in-feedback.component.html',
  styleUrls: ['./self-check-in-feedback.component.scss']
})
export class SelfCheckInFeedbackComponent implements OnInit {
  @Input() checkInFormStatus: CheckInFormStatus;
  envRootPath = environment.root;
  constructor() { }

  ngOnInit(): void {
  }

  isSubmittedSuccessfully() {
    return SelfCheckInUtils.isSubmittedSuccessfully(this.checkInFormStatus);
  }

  isNotAvailable() {
    return SelfCheckInUtils.isNotAvailable(this.checkInFormStatus) || this.checkInFormStatus  === CheckInFormStatus.LinkNotAvailable;
  }
}
