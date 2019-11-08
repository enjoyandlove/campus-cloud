import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

import { MOCK_IMAGE } from '@campus-cloud/shared/tests';

export const emptyCalendarFormGroup = new FormBuilder().group({
  name: [''],
  description: [''],
  has_membership: [0]
});

export const mockCalendarItemForm = new FormBuilder().group({
  items: new FormBuilder().array([
    new FormBuilder().group({
      end: [0],
      start: [0],
      title: ['title'],
      latitude: [0],
      longitude: [0],
      location: [null],
      poster_url: [MOCK_IMAGE],
      description: ['description'],
      poster_thumb_url: [MOCK_IMAGE]
    })
  ])
});

export const filledForm = {
  name: 'Test calendar name',
  description: 'Test calendar description',
  has_membership: 1
};

export const mockCalendar = {
  id: 1,
  ...filledForm
};

export class MockActivatedRoute {
  snapshot = {
    params: {
      calendarId: mockCalendar.id
    }
  };
}

export class MockCalendarsService {
  createCalendar() {}

  getCalendarById() {
    return of(mockCalendar);
  }

  getItemsByCalendarId() {
    return of(mockCalendar);
  }
}
