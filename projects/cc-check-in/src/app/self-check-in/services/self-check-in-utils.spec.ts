import { SelfCheckInUtils } from './self-check-in-utils';
import { CheckInFormStatus } from '@projects/cc-check-in/src/app/self-check-in/self-check-in.models';
import { CheckInMethod } from '@controlpanel/manage/events/event.status';

describe('SelfCheckInUtils', () => {
  it('should check if submitted', () => {
    expect(SelfCheckInUtils.isSubmittedSuccessfully(CheckInFormStatus.Email)).toBeFalse();
    expect(SelfCheckInUtils.isSubmittedSuccessfully(CheckInFormStatus.FormNotAvailable)).toBeFalse();
    expect(SelfCheckInUtils.isSubmittedSuccessfully(CheckInFormStatus.SubmittedSuccess)).toBeTrue();
  });
  it('should calculate check-in form status', () => {
    expect(SelfCheckInUtils.calculateCheckInFormStatus(
      [CheckInMethod.userWebEntry, CheckInMethod.app])).toEqual(CheckInFormStatus.QR_Email);
    expect(SelfCheckInUtils.calculateCheckInFormStatus([CheckInMethod.userWebEntry])).toEqual(CheckInFormStatus.Email);
    expect(SelfCheckInUtils.calculateCheckInFormStatus([CheckInMethod.app])).toEqual(CheckInFormStatus.QR);
    expect(SelfCheckInUtils.calculateCheckInFormStatus([CheckInMethod.deepLink])).toEqual(CheckInFormStatus.OnlyDeepLinkByAppIsAvailable);
    expect(SelfCheckInUtils.calculateCheckInFormStatus(
      [CheckInMethod.web, CheckInMethod.webQr])).toEqual(CheckInFormStatus.FormNotAvailable);
  });
});
