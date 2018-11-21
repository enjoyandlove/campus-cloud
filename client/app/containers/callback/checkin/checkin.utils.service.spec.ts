import { CheckinUtilsService } from './checkin.utils.service';
import { amplitudeEvents } from '../../../shared/constants/analytics';
import { EventCategory } from '../../controlpanel/manage/events/event.status';

const service = new CheckinUtilsService(null);

describe('CheckInUtilsService', () => {
  let events;
  let sourceId;
  let eventProperties;

  it('should get check-in source name', () => {
    let checkInSourceName = service.getCheckInSource(EventCategory.athletics);

    expect(checkInSourceName).toEqual(amplitudeEvents.ATHLETIC_EVENT);

    checkInSourceName = service.getCheckInSource(EventCategory.services);

    expect(checkInSourceName).toEqual(amplitudeEvents.SERVICE_EVENT);
  });

  it('should get checked-in event properties', () => {
    sourceId = 8874;
    events = {
      has_checkout: false,
      store_category: EventCategory.athletics,
      checkin_verification_methods: [1, 2, 3]
    };

    eventProperties = service.getCheckedInEventProperties(sourceId, events);

    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.assessment_type).toEqual(amplitudeEvents.SERVICE_PROVIDER);

    sourceId = 8547;
    events = {
      store_category: EventCategory.club,
      has_checkout: true,
      attend_verification_methods: [1, 2]
    };

    eventProperties = service.getCheckedInEventProperties(sourceId, events, true);

    expect(eventProperties.source_id).toEqual(sourceId);
    expect(eventProperties.qr_code_status).toEqual(amplitudeEvents.DISABLED);
    expect(eventProperties.check_out_status).toEqual(amplitudeEvents.ENABLED);
    expect(eventProperties.assessment_type).toEqual(amplitudeEvents.CLUB_EVENT);
  });
});
