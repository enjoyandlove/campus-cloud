import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.scss'],
})
export class CalendarsFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() isOrientation = false;
  @Input() orientationProgram;

  @Output()
  submitted: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

  isChecked = true;

  constructor() {}

  toggleMembership(value) {
    value = value ? 1 : -1;
    this.form.controls['has_membership'].setValue(value);
  }

  ngOnInit() {
    if (this.isOrientation) {
      this.isChecked = this.form.value.has_membership === 1;
    }
  }
}
