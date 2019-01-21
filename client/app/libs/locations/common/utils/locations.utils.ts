import { FormArray, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

import { getItem } from '@shared/components';
import { ScheduleModel, scheduleLabels } from '../model';
import { ICategory } from '@containers/controlpanel/manage/locations/categories/model';

@Injectable()
export class LocationsUtilsService {
  constructor() {}

  static getScheduleLabel(day) {
    return scheduleLabels[day];
  }

  static filteredScheduleControls(form: FormGroup, hasOpeningHours) {
    const controls = <FormArray>form.controls['schedule'];

    return controls.controls
      .filter((control: FormGroup) => control.controls['is_checked'].value && hasOpeningHours)
      .map((ctr: FormGroup) => ctr.value);
  }

  static setScheduleFormControls(form: FormGroup, schedule = []) {
    const days = Array.from(Array(7).keys());
    const controls = <FormArray>form.controls['schedule'];

    days.forEach((d) => {
      const day = d + 1;
      const scheduleForm = ScheduleModel.form();

      scheduleForm.get('day').setValue(day);

      if (schedule.length) {
        this.setItemControls(scheduleForm, schedule, day);
      }

      controls.push(scheduleForm);
    });
  }

  static setItemControls(scheduleForm, schedule, day) {
    const controlItems = <FormArray>scheduleForm.controls['items'];

    const openingHour = schedule.find((d) => d.day === day);

    if (openingHour) {
      this.setOpeningHours(openingHour, controlItems, scheduleForm);
    }
  }

  static setOpeningHours(openingHours, controlItems, scheduleForm) {
    scheduleForm.get('is_checked').setValue(true);

    openingHours.items.forEach((time) => {
      controlItems.push(ScheduleModel.setItemControls(time));
    });

    controlItems.removeAt(0);
  }

  static setCategoriesDropDown(categories: ICategory[], label: string) {
    const _heading = [
      {
        label,
        action: null
      }
    ];

    const _categories = categories.map((category: ICategory) => {
      return getItem(category, 'name', 'id');
    });

    return [..._heading, ..._categories];
  }

  static getLocationTiming() {
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
