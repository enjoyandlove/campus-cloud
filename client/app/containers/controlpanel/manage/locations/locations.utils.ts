import { Injectable } from '@angular/core';

@Injectable()
export class LocationsUtilsService {
  constructor() {}

  locationOpeningHours() {
    return [
      {
        day: 1,
        open: '17:00',
        close: '17:30',
        label: 't_monday'
      },
      {
        day: 2,
        open: '17:00',
        close: '17:30',
        label: 't_tuesday'
      },
      {
        day: 3,
        open: '17:00',
        close: '17:30',
        label: 't_wednesday'
      },
      {
        day: 4,
        open: '17:00',
        close: '17:30',
        label: 't_thursday'
      },
      {
        day: 5,
        open: '17:00',
        close: '17:30',
        label: 't_friday'
      },
      {
        day: 6,
        open: '17:00',
        close: '17:30',
        label: 't_saturday'
      },
      {
        day: 7,
        open: '17:00',
        close: '17:30',
        label: 't_sunday'
      }
    ];
  }
}
