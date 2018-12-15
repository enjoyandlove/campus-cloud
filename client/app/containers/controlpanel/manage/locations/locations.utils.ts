import { Injectable } from '@angular/core';

export enum ScheduleDays {
  'Monday' = 1,
  'Tuesday' = 2,
  'Wednesday' = 3,
  'Thursday' = 4,
  'Friday' = 5,
  'Saturday' = 6,
  'Sunday' = 7
}

@Injectable()
export class LocationsUtilsService {
  constructor() {}

  locationOpeningHours() {
    return [
      {
        is_checked: false,
        label: 't_shared_monday',
        day: ScheduleDays.Monday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          },
        ]
      },
      {
        is_checked: false,
        label: 't_shared_tuesday',
        day: ScheduleDays.Tuesday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          }
        ]
      },
      {
        is_checked: false,
        label: 't_shared_wednesday',
        day: ScheduleDays.Wednesday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          }
        ]
      },
      {
        is_checked: false,
        label: 't_shared_thursday',
        day: ScheduleDays.Thursday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          }
        ]
      },
      {
        is_checked: false,
        label: 't_shared_friday',
        day: ScheduleDays.Friday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          }
        ]
      },
      {
        is_checked: false,
        label: 't_shared_saturday',
        day: ScheduleDays.Saturday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          }
        ]
      },
      {
        is_checked: false,
        label: 't_shared_sunday',
        day: ScheduleDays.Sunday,
        items: [
          {
            link: null,
            notes: null,
            end_time: 61200,
            start_time: 32400
          }
        ]
      }
    ];
  }

  getLocationTiming() {
    return [
      {
        value: 1800,
        label: '12:30 AM'
      },
      {
        value: 3600,
        label: '1:00 AM'
      },
      {
        value: 5400,
        label: '1:30 AM'
      },
      {
        value: 7200,
        label: '2:00 AM'
      },
      {
        value: 9000,
        label: '2:30 AM'
      },
      {
        value: 10800,
        label: '3:00 AM'
      },
      {
        value: 12600,
        label: '3:30 AM'
      },
      {
        value: 14400,
        label: '4:00 AM'
      },
      {
        value: 16200,
        label: '4:30 AM'
      },
      {
        value: 18000,
        label: '5:00 AM'
      },
      {
        value: 19800,
        label: '5:30 AM'
      },
      {
        value: 21600,
        label: '6:00 AM'
      },
      {
        value: 23400,
        label: '6:30 AM'
      },
      {
        value: 25200,
        label: '7:70 AM'
      },
      {
        value: 27000,
        label: '7:30 AM'
      },
      {
        value: 28800,
        label: '8:00 AM'
      },
      {
        value: 30600,
        label: '8:30 AM'
      },
      {
        value: 32400,
        label: '9:00 AM'
      },
      {
        value: 34200,
        label: '9:30 AM'
      },
      {
        value: 36000,
        label: '10:00 AM'
      },
      {
        value: 37800,
        label: '10:30 AM'
      },
      {
        value: 39600,
        label: '11:00 AM'
      },
      {
        value: 41400,
        label: '11:30 AM'
      },
      {
        value: 43200,
        label: '12:00 PM'
      },
      {
        value: 45000,
        label: '12:30 PM'
      },
      {
        value: 46800,
        label: '1:00 PM'
      },
      {
        value: 48600,
        label: '1:30 PM'
      },
      {
        value: 50400,
        label: '2:00 PM'
      },
      {
        value: 52200,
        label: '2:30 PM'
      },
      {
        value: 54000,
        label: '3:00 PM'
      },
      {
        value: 55800,
        label: '3:30 PM'
      },
      {
        value: 57600,
        label: '4:00 PM'
      },
      {
        value: 59400,
        label: '4:30 PM'
      },
      {
        value: 61200,
        label: '5:00 PM'
      },
      {
        value: 63000,
        label: '5:30 PM'
      },
      {
        value: 64800,
        label: '6:00 PM'
      },
      {
        value: 66600,
        label: '6:30 PM'
      },
      {
        value: 68400,
        label: '7:00 PM'
      },
      {
        value: 70200,
        label: '7:30 PM'
      },
      {
        value: 72000,
        label: '8:00 PM'
      },
      {
        value: 73800,
        label: '8:30 PM'
      },
      {
        value: 75600,
        label: '9:00 PM'
      },
      {
        value: 77400,
        label: '9:30 PM'
      },
      {
        value: 79200,
        label: '10:00 PM'
      },
      {
        value: 81000,
        label: '10:30 PM'
      },
      {
        value: 82800,
        label: '11:00 PM'
      },
      {
        value: 84600,
        label: '11:30 PM'
      },
      {
        value: 0,
        label: '12:00 AM'
      }
    ];
  }
}
