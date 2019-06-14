import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';
import { ILocationTiming, ScheduleModel } from '@campus-cloud/libs/locations/common/model';

@Component({
  selector: 'cp-dining-opening-hours-form',
  templateUrl: './dining-opening-hours-form.component.html',
  styleUrls: ['./dining-opening-hours-form.component.scss']
})
export class DiningOpeningHoursFormComponent implements OnInit {
  @Input() formErrors: boolean;
  @Input() diningForm: FormGroup;

  diningTiming: ILocationTiming[];

  constructor() {}

  onTimeSelected(schedule, key, index, itemIndex) {
    const controls = <FormArray>this.diningForm.controls['schedule'];

    const control = <FormGroup>controls.controls[index];
    const controlItems = <FormArray>control.controls['items'];
    const controlItem = <FormGroup>controlItems.controls[itemIndex];
    controlItem.controls[key].setValue(schedule.value);
  }

  onDayCheck(checked, index) {
    const controls = <FormArray>this.diningForm.controls['schedule'];
    const control = <FormGroup>controls.controls[index];

    control.controls['is_checked'].setValue(checked);
  }

  getSelectedTime(selectedTime) {
    return this.diningTiming.find((time) => time.value === selectedTime);
  }

  addItem(schedule) {
    const controlItems = <FormArray>schedule.controls['items'];

    controlItems.push(ScheduleModel.setItemControls());
  }

  removeItem(schedule, index) {
    const controlItems = <FormArray>schedule.controls['items'];

    controlItems.removeAt(index);
  }

  ngOnInit(): void {
    this.diningTiming = LocationsUtilsService.getLocationTiming();
  }
}
