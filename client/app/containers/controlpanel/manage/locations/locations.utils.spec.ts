import { FormArray, FormBuilder } from '@angular/forms';

import { mockSchedule } from './tests';
import { ScheduleDays, ScheduleModel } from './model';
import { LocationsUtilsService } from './locations.utils';

describe('LocationsUtils', () => {
  const fb = new FormBuilder();

  const schedule = fb.group({
    day: ScheduleDays.Monday,
    is_checked: true,
    items: fb.array([])
  });

  const locationForm = fb.group({
    name: [null],
    email: [null],
    schedule: fb.array([schedule])
  });

  it('should filter schedule controls if opening hours open', () => {
    const hasOpeningHours = true;
    const filteredControls = LocationsUtilsService.filteredScheduleControls(locationForm, hasOpeningHours);

    expect(filteredControls.length).toBe(1);
  });

  it('should filter schedule controls if opening hours close', () => {
    const hasOpeningHours = false;
    const filteredControls = LocationsUtilsService.filteredScheduleControls(locationForm, hasOpeningHours);

    expect(filteredControls).toEqual([]);
  });

  it('should set schedule form controls', () => {
    const scheduleForm = <FormArray>locationForm.controls['schedule'];
    // remove above first added control
    scheduleForm.removeAt(0);

    LocationsUtilsService.setScheduleFormControls(locationForm);

    const controls = <FormArray>locationForm.controls['schedule'];

    expect(controls.length).toBe(7);
  });

  it('should set schedule form items controls', () => {
    const scheduleForm = ScheduleModel.form();

    const day = ScheduleDays.Tuesday;

    scheduleForm.get('day').setValue(day);

    LocationsUtilsService.setItemControls(scheduleForm, mockSchedule, day);

    const expected = mockSchedule[0]['items'][0];

    const result = scheduleForm.value['items'][0];

    expect(result).toEqual(expected);
  });
});
