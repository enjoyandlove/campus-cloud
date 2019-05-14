import { FormArray, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

import { CPI18nService } from '@shared/services';
import { getItem, IItem } from '@shared/components';
import { amplitudeEvents } from '@shared/constants';
import { ScheduleModel, scheduleLabels } from '../model';
import { LocationsTimeLabelPipe } from '@libs/locations/common/pipes';
import { ICategory, categoryTypes } from '@libs/locations/common/categories/model';

const days = Array.from(Array(7).keys());

@Injectable()
export class LocationsUtilsService {
  constructor(public cpI18n: CPI18nService, public timeLabelPipe: LocationsTimeLabelPipe) {}

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
        value: 0,
        label: '12:00 AM'
      },
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
        label: '7:00 AM'
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
      }
    ];
  }

  parsedSchedule(schedule) {
    const openingHours = [];

    days.forEach((day) => {
      const selectedDay = schedule.find((d) => d.day === day + 1);

      if (selectedDay) {
        const items = selectedDay.items.map((item) => {
          return {
            name: item.name,
            time:
              this.timeLabelPipe.transform(item.start_time) +
              ' - ' +
              this.timeLabelPipe.transform(item.end_time)
          };
        });

        openingHours.push({
          items,
          day: selectedDay.day
        });
      } else {
        openingHours.push({
          day: day + 1,
          time: this.cpI18n.translate('t_shared_closed')
        });
      }
    });

    return openingHours;
  }

  parsedEventProperties(data) {
    const label = data.links.length ? data.links[0].label : false;

    const hours_of_operations = data.schedule.length;
    const link = label ? amplitudeEvents.YES : amplitudeEvents.NO;
    const email = data.email ? amplitudeEvents.YES : amplitudeEvents.NO;
    const acronym = data.short_name ? amplitudeEvents.YES : amplitudeEvents.NO;
    const phone_number = data.phone ? amplitudeEvents.YES : amplitudeEvents.NO;
    const added_address = data.address ? amplitudeEvents.YES : amplitudeEvents.NO;
    const uploaded_image = data.image_url ? amplitudeEvents.YES : amplitudeEvents.NO;

    const category_status = data.category_is_default
      ? amplitudeEvents.DEFAULT
      : amplitudeEvents.CUSTOM;

    return {
      link,
      email,
      acronym,
      phone_number,
      added_address,
      uploaded_image,
      category_status,
      hours_of_operations
    };
  }

  getLocationTypes(): Array<IItem> {
    return [
      { label: '---', action: null },
      {
        label: this.cpI18n.translate('t_location_category_type_building'),
        action: categoryTypes.building
      },
      {
        label: this.cpI18n.translate('t_location_category_type_dining'),
        action: categoryTypes.dining
      },
      {
        label: this.cpI18n.translate('t_location_category_type_location'),
        action: categoryTypes.location
      }
    ];
  }
}
