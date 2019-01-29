import { FormArray, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { ILocationTiming, ScheduleModel } from '@libs/locations/common/model';
import { LocationsUtilsService } from '@libs/locations/common/utils';

@Component({
  selector: 'cp-dining-opening-hours-form',
  templateUrl: './dining-opening-hours-form.component.html',
  styleUrls: ['./dining-opening-hours-form.component.scss']
})
export class DiningOpeningHoursFormComponent implements OnInit {
  @Input() formErrors: boolean;
  @Input() diningForm: FormGroup;

  locationTiming: ILocationTiming[];

  constructor() {}

  onTimeSelected(schedule, key, index, itemIndex) {
    const controls = <FormArray>this.diningForm.controls['schedule'];

    const control = <FormGroup>controls.controls[index];
    const controlItems = <FormArray>control.controls['items'];
    const controlFirstItem = <FormGroup>controlItems.controls[itemIndex];
    controlFirstItem.controls[key].setValue(schedule.value);
  }

  onDayCheck(checked, index) {
    const controls = <FormArray>this.diningForm.controls['schedule'];
    const control = <FormGroup>controls.controls[index];

    control.controls['is_checked'].setValue(checked);
  }

  getDayLabel(day) {
    return LocationsUtilsService.getScheduleLabel(day);
  }

  getSelectedTime(selectedTime) {
    return this.locationTiming.find((time) => time.value === selectedTime);
  }

  addItem(schedule) {
    const controlItems = <FormArray>schedule.controls['items'];

    controlItems.controls.push(ScheduleModel.setItemControls());
  }

  removeItem(schedule, index) {
    const controlItems = <FormArray>schedule.controls['items'];

    console.log(controlItems.controls.length);
    if (controlItems.controls.length <= 1) {
      return;
    }

    controlItems.removeAt(index);
  }

  ngOnInit(): void {
    this.locationTiming = LocationsUtilsService.getLocationTiming();
  }
}
