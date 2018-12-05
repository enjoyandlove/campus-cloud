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
  @Input() formErrors: boolean;
  @Input() location: LocationModel;

  selectedTo;
  openingHours;
  selectedFrom;
  locationTiming = require('../../locationTiming.json');

  constructor(
    public fb: FormBuilder,
    public utils: LocationsUtilsService
  ) {}

  onTimeSelected(time, index, key) {
    const controls = <FormArray>this.location.form.controls['schedule'];
    const control = <FormGroup>controls.controls[index];

    if (control) {
      control.controls[key].setValue(time.value);
    }
  }

  onDayCheck(checked, item, index) {
    checked ? this.addControl(item) : this.removeControl(index);
  }

  addControl(item) {
    const controls = <FormArray>this.location.form.controls['schedule'];
    controls.push(this.buildScheduleControl(item));

    this.loadSchedule();
  }

  removeControl(index) {
    const control = <FormArray>this.location.form.controls['schedule'];
    control.removeAt(index);
  }

  buildScheduleControl(item) {
    return this.fb.group({
      day: [item.day],
      label: [item.label],
      open: [item.open],
      close: [item.close],
      notes: [null],
      link: [null],
    });
  }

  loadSchedule() {
    const schedules = <FormArray>this.location.form.controls['schedule'];

    if (schedules.length) {
      schedules.controls.map((item, index) => {
        console.log(item, index);
      });
    }
  }

  ngOnInit(): void {
    this.loadSchedule();
    this.openingHours = this.utils.locationOpeningHours();
    this.selectedTo = this.locationTiming.filter((time) => time.value === '17:00')[0];
    this.selectedFrom = this.locationTiming.filter((time) => time.value === '09:00')[0];
  }
}
