import { FormArray, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { ILocationTiming } from '@libs/locations/common/model';
import { LocationsUtilsService } from '@libs/locations/common/utils';

@Component({
  selector: 'cp-location-opening-hours-form',
  templateUrl: './location-opening-hours-form.component.html',
  styleUrls: ['./location-opening-hours-form.component.scss']
})
export class LocationOpeningHoursFormComponent implements OnInit {
  @Input() formErrors: boolean;
  @Input() locationForm: FormGroup;

  locationTiming: ILocationTiming[];

  constructor() {}

  onTimeSelected(schedule, key, index) {
    const controls = <FormArray>this.locationForm.controls['schedule'];

    const control = <FormGroup>controls.controls[index];
    const controlItems = <FormArray>control.controls['items'];
    const controlFirstItem = <FormGroup>controlItems.controls[0];
    controlFirstItem.controls[key].setValue(schedule.value);
  }

  onDayCheck(checked, index) {
    const controls = <FormArray>this.locationForm.controls['schedule'];
    const control = <FormGroup>controls.controls[index];

    control.controls['is_checked'].setValue(checked);
  }

  getDayLabel(day) {
    return LocationsUtilsService.getScheduleLabel(day);
  }

  getSelectedTime(selectedTime) {
   return this.locationTiming.find((time) => time.value === selectedTime);
  }

  ngOnInit(): void {
    this.locationTiming = LocationsUtilsService.getLocationTiming();
  }
}
