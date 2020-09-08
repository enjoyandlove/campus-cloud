import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import { CheckInMethod, SelfCheckInOption } from '@controlpanel/manage/events/event.status';

describe('EventUtilService Tests', () => {
  it('getSelfCheckInStatus Should true when qr is selected', function() {
    const selfCheckInStatus = EventUtilService.getSelfCheckInStatus([CheckInMethod.app],
      SelfCheckInOption.qr);
    expect(selfCheckInStatus).toBeTruthy();
  });

  it('getSelfCheckInStatus Should true when email is selected', function() {
    const selfCheckInStatus = EventUtilService.getSelfCheckInStatus([CheckInMethod.userWebEntry],
      SelfCheckInOption.email);
    expect(selfCheckInStatus).toBeTruthy();
  });
});
