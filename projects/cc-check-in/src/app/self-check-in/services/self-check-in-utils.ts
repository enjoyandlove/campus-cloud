import { CheckInFormStatus } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.models';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';

export class SelfCheckInUtils {
  static isSubmittedSuccessfully(checkInFormStatus: CheckInFormStatus) {
    return checkInFormStatus === CheckInFormStatus.SubmittedSuccess;
  }

  static onlyDeepLinkByAppIsAvailable(checkInFormStatus: CheckInFormStatus) {
    return checkInFormStatus === CheckInFormStatus.OnlyDeepLinkByAppIsAvailable;
  }

  static isNotAvailable(checkInFormStatus: CheckInFormStatus) {
    return checkInFormStatus === CheckInFormStatus.FormNotAvailable;
  }

  static displayQR(checkInFormStatus: CheckInFormStatus) {
    return checkInFormStatus === CheckInFormStatus.QR_Email ||
      checkInFormStatus === CheckInFormStatus.QR;
  }

  static displayForm(checkInFormStatus: CheckInFormStatus) {
    return checkInFormStatus === CheckInFormStatus.QR_Email ||
      checkInFormStatus === CheckInFormStatus.Email;
  }

  static calculateCheckInFormStatus(selfCheckinMethods: number[]) {
    if (selfCheckinMethods.includes(CheckInMethod.userWebEntry) && selfCheckinMethods.includes(CheckInMethod.app)) {
      return CheckInFormStatus.QR_Email;
    }
    if (selfCheckinMethods.includes(CheckInMethod.userWebEntry)) {
      return CheckInFormStatus.Email;
    }
    if (selfCheckinMethods.includes(CheckInMethod.app)) {
      return CheckInFormStatus.QR;
    }
    if (selfCheckinMethods.includes(CheckInMethod.deepLink)) {
      return CheckInFormStatus.OnlyDeepLinkByAppIsAvailable;
    }
    return CheckInFormStatus.FormNotAvailable;
  }
}
