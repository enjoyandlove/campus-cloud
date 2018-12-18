import { FormBuilder } from '@angular/forms';

export enum ScheduleTime {
  'nineAM' = 32400,
  'fivePM' = 61200
}

export enum ScheduleDays {
  'Monday' = 1,
  'Tuesday' = 2,
  'Wednesday' = 3,
  'Thursday' = 4,
  'Friday' = 5,
  'Saturday' = 6,
  'Sunday' = 7
}

export const scheduleLabels = {
  [ScheduleDays.Monday]: 't_shared_monday',
  [ScheduleDays.Sunday]: 't_shared_sunday',
  [ScheduleDays.Friday]: 't_shared_friday',
  [ScheduleDays.Tuesday]: 't_shared_tuesday',
  [ScheduleDays.Thursday]: 't_shared_thursday',
  [ScheduleDays.Saturday]: 't_shared_saturday',
  [ScheduleDays.Wednesday]: 't_shared_wednesday',
};

export class ScheduleModel {
  static form() {
    const fb = new FormBuilder();

    return fb.group({
      day: [null],
      is_checked: [false],
      items: fb.array([this.setItemControls()])
    });
  }

  static setItemControls(items?) {
    const fb = new FormBuilder();

    return fb.group({
      url: [items ? items.url : null],
      name: [items ? items.name : null],
      description: [items ? items.description : null],
      end_time: [items ? items.end_time : ScheduleTime.fivePM],
      start_time: [items ? items.start_time : ScheduleTime.nineAM]
    });
  }
}
