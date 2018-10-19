import { CheckinUtilsService } from './checkin.utils.service';
import { amplitudeEvents } from '../../../shared/constants/analytics';

const service = new CheckinUtilsService(null);

describe('CheckInUtilsService', () => {
  let userId;
  let events;
  let sourceId;
  let checkInSource;
  let eventProperties;

  it('getCheckedInEventProperties', () => {
    userId = 452;
    sourceId = 8874;
    events = {
      has_checkout: false,
      checkin_verification_methods: [1, 2, 3]
    };

    eventProperties = service.getCheckedInEventProperties(sourceId, events, userId);

    expect(eventProperties.user_id).toEqual(userId);
    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.check_in_type).toEqual(amplitudeEvents.SERVICE_PROVIDER);

    userId = 154;
    sourceId = 8547;
    checkInSource = 'services';
    events = {
      has_checkout: true,
      attend_verification_methods: [1, 2]
    };

    eventProperties = service.getCheckedInEventProperties(sourceId, events, userId, checkInSource);

    expect(eventProperties.user_id).toEqual(userId);
    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.check_in_type).toEqual(amplitudeEvents.SERVICE_EVENT);
  });
});
