import { CheckinUtilsService } from './checkin.utils.service';
import { amplitudeEvents } from '../../../shared/constants/analytics';
import { CheckInSource } from '../../controlpanel/manage/events/event.status';

const service = new CheckinUtilsService(null);

describe('CheckInUtilsService', () => {
  let userId;
  let events;
  let sourceId;
  let checkInSource;
  let eventProperties;

  it('should get check-in source name', () => {
    let checkInSourceName = service.getCheckInSource(CheckInSource.events);

    expect(checkInSourceName).toEqual(amplitudeEvents.INSTITUTION_EVENT);

    checkInSourceName = service.getCheckInSource(CheckInSource.services);

    expect(checkInSourceName).toEqual(amplitudeEvents.SERVICE_EVENT);
  });

  it('should get checked-in event properties', () => {
    userId = 452;
    sourceId = 8874;
    checkInSource = CheckInSource.services;
    events = {
      has_checkout: false,
      checkin_verification_methods: [1, 2, 3]
    };

    eventProperties = service.getCheckedInEventProperties(sourceId, events, userId, checkInSource);

    expect(eventProperties.user_id).toEqual(userId);
    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.check_in_type).toEqual(amplitudeEvents.SERVICE_PROVIDER);

    userId = 154;
    sourceId = 8547;
    checkInSource = CheckInSource.events;
    events = {
      has_checkout: true,
      attend_verification_methods: [1, 2]
    };

    eventProperties = service.getCheckedInEventProperties(
      sourceId,
      events,
      userId,
      checkInSource,
      true
    );

    expect(eventProperties.user_id).toEqual(userId);
    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.check_in_type).toEqual(amplitudeEvents.INSTITUTION_EVENT);
  });
});
