import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormArray } from '@angular/forms/src/model';

import { CPSession } from '../../../../../../../session';

@Component({
  selector: 'cp-calendars-items-bulk-create-form',
  templateUrl: './calendars-items-bulk-create-form.component.html',
  styleUrls: ['./calendars-items-bulk-create-form.component.scss']
})
export class CalendarsItemsBulkCreateFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Output() submitted: EventEmitter<any> = new EventEmitter();

  buttonData;

  constructor(public session: CPSession) {}

  onSubmit() {
    this.submitted.emit(this.form.value);
    this.enableSubmitButton();
  }

  resetToSchoolDefaults(index) {
    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['location'].setValue('');
    control.controls['latitude'].setValue(this.session.g.get('school').latitude);
    control.controls['longitude'].setValue(this.session.g.get('school').longitude);
  }

  onPlaceChange(placeData, index) {
    if (!placeData) {
      this.resetToSchoolDefaults(index);

      return;
    }

    const coords: google.maps.LatLngLiteral = placeData.geometry.location.toJSON();

    const controls = <FormArray>this.form.controls['items'];
    const control = <FormGroup>controls.controls[index];

    control.controls['latitude'].setValue(coords.lat);
    control.controls['longitude'].setValue(coords.lng);

    control.controls['location'].setValue(placeData.name);
  }

  enableSubmitButton() {
    this.buttonData = { ...this.buttonData, disabled: false };
  }

  ngOnInit() {
    this.buttonData = {
      text: 'Import Items',
      class: 'primary'
    };

    this.form.valueChanges.subscribe((_) => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
