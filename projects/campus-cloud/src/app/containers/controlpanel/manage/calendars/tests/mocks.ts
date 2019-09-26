import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';

export const emptyCalendarFormGroup = new FormBuilder().group({
  name: [''],
  description: [''],
  has_membership: [0]
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
    return of([]);
  }
}
