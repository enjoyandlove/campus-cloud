import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'cp-orientation-program-form',
  templateUrl: './orientation-program-form.component.html',
  styleUrls: ['./orientation-program-form.component.scss'],
})
export class OrientationProgramFormComponent implements OnInit {
  @Input() form: FormGroup;

  @Output()
  submitted: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

  isChecked = true;

  constructor() {}

  toggleMembership(value) {
    value = value ? 1 : 0;
    this.form.controls['is_membership'].setValue(value);
  }

  ngOnInit() {}
}
