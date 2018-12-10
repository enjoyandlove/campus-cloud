import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

import { LocationModel } from '../../model';
import { LocationsUtilsService } from '../../locations.utils';

@Component({
  selector: 'cp-location-opening-hours-form',
  templateUrl: './location-opening-hours-form.component.html',
  styleUrls: ['./location-opening-hours-form.component.scss']
})
export class LocationOpeningHoursFormComponent implements OnInit {
  @Input() schedule;
  @Input() formErrors: boolean;
  @Input() location: LocationModel;

  openingHours;
  locationTiming;

  constructor(
    public fb: FormBuilder,
    public utils: LocationsUtilsService
  ) {}

  onTimeSelected(schedule, item, key, index) {
    const controls = <FormArray>this.location.form.controls['schedule'];
    const itemIndex = controls.value.findIndex((items) => items.day === item.day);

    this.openingHours[index].items[0][key] = schedule.value;

    if (itemIndex >= 0) {
      const control = <FormGroup>controls.controls[itemIndex];
      const controlItems = <FormArray>control.controls['items'];
      const controlFirstItem = <FormGroup>controlItems.controls[0];
      controlFirstItem.controls[key].setValue(schedule.value);
    }
  }

  onDayCheck(checked, item) {
    checked ? this.addControl(item) : this.removeControl(item);
  }

  addControl(item) {
    const controls = <FormArray>this.location.form.controls['schedule'];

    controls.push((this.buildScheduleControl(item)));
  }

  removeControl(item) {
    const control = <FormArray>this.location.form.controls['schedule'];
    const index = control.value.findIndex((items) => items.day === item.day);
    control.removeAt(index);
  }

  buildScheduleControl(schedule) {
    return this.fb.group({
      day: schedule.day,
      items: this.fb.array([
        this.fb.group({
          open: schedule.items[0].open,
          close: schedule.items[0].close
        })
      ])
    });
  }

  getSelectedTime(selectedTime) {
   return this.locationTiming.find((time) => time.value === selectedTime);
  }

  updateScheduleArray() {
    if (!this.schedule) {
      return;
    }

    this.openingHours.forEach((openingHours, index) => {
      this.schedule.forEach((schedule) => {
        if (openingHours.day === schedule.day) {
          this.openingHours[index].is_checked = true;
          this.openingHours[index].items = [];
          this.openingHours[index].items = (schedule.items);
        }
      });
    });
  }

  ngOnInit(): void {
    this.locationTiming = this.utils.getLocationTiming();
    this.openingHours = this.utils.locationOpeningHours();
    this.updateScheduleArray();
  }
}
