import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from '@campus-cloud/shared/tests';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { EventCategory } from '@controlpanel/manage/events/event.status';
import { EventsAmplitudeService } from '@controlpanel/manage/events/events.amplitude.service';

describe('EventsAmplitudeService', () => {
  configureTestSuite();

  let service: EventsAmplitudeService;

  beforeAll((done) =>
    (async () => {
      TestBed.configureTestingModule({
        providers: [EventsAmplitudeService]
      });

      await TestBed.compileComponents();
    })()
      .then(done)
      .catch(done.fail)
  );

  beforeEach(() => {
    service = TestBed.get(EventsAmplitudeService);
  });

  it('should get property status', () => {
    let status = EventsAmplitudeService.getPropertyStatus(true);

    expect(status).toBe(amplitudeEvents.YES);

    status = EventsAmplitudeService.getPropertyStatus(false);

    expect(status).toBe(amplitudeEvents.NO);
  });

  it('should get checkout status', () => {
    let hasCheckout = { has_checkout: true };
    let status = EventsAmplitudeService.getCheckOutStatus(hasCheckout);

    expect(status).toBe(amplitudeEvents.ENABLED);

    hasCheckout = { has_checkout: false };
    status = EventsAmplitudeService.getCheckOutStatus(hasCheckout);

    expect(status).toBe(amplitudeEvents.DISABLED);
  });

  it('should get event type', () => {
    let isExternal = true;
    let status = EventsAmplitudeService.getEventType(isExternal);

    expect(status).toBe(amplitudeEvents.FEED_INTEGRATION);

    isExternal = false;
    status = EventsAmplitudeService.getEventType(isExternal);

    expect(status).toBe(amplitudeEvents.MANUAL);
  });

  it('should get date status', () => {
    let date;

    const now = new Date();
    const today = Math.round(now.getTime() / 1000);
    const tomorrow = Math.round(now.setDate(now.getDate() + 1) / 1000);

    date = {
      end: 0,
      start: 0
    };

    let status = EventsAmplitudeService.getDateStatus(date);

    expect(status).toBe(amplitudeEvents.NO_DATE);

    date = {
      start: 0,
      end: today
    };

    status = EventsAmplitudeService.getDateStatus(date);

    expect(status).toBe(amplitudeEvents.END_DATE);

    date = {
      end: 0,
      start: today
    };

    status = EventsAmplitudeService.getDateStatus(date);

    expect(status).toBe(amplitudeEvents.START_DATE);

    date = {
      start: today,
      end: tomorrow
    };

    status = EventsAmplitudeService.getDateStatus(date);

    expect(status).toBe(amplitudeEvents.START_END_DATE);
  });

  it('should get event category type', () => {
    let categoryType = EventCategory.club;

    let type = EventsAmplitudeService.getEventCategoryType(categoryType);

    expect(type).toBe(amplitudeEvents.CLUB_EVENT);

    categoryType = EventCategory.athletics;

    type = EventsAmplitudeService.getEventCategoryType(categoryType);

    expect(type).toBe(amplitudeEvents.ATHLETIC_EVENT);

    categoryType = EventCategory.services;

    type = EventsAmplitudeService.getEventCategoryType(categoryType);

    expect(type).toBe(amplitudeEvents.SERVICE_EVENT);

    categoryType = null;

    type = EventsAmplitudeService.getEventCategoryType(categoryType);

    expect(type).toBe(amplitudeEvents.ORIENTATION_EVENT);
  });
});
