import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ProgramMembership } from '../../../orientation/orientation.status';
import { ITodo } from '../../../orientation/todos/todos.interface';
import { CPDate } from '../../../../../../shared/utils';

const FORMAT_WITH_TIME = 'F j, Y h:i K';

const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: FORMAT_WITH_TIME,
};

@Component({
  selector: 'cp-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.scss']
})
export class CalendarsFormComponent implements OnInit {
  @Input() todo: ITodo;
  @Input() form: FormGroup;
  @Input() isTodo = false;
  @Input() isOrientation = false;
  @Input() orientationProgram;

  @Output()
  submitted: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

  dueDate;
  isChecked = true;

  constructor() {}

  toggleMembership(value) {
    value = value ? ProgramMembership.enabled : ProgramMembership.disabled;
    this.form.controls['has_membership'].setValue(value);
  }

  ngOnInit() {
    if (this.isOrientation) {
      this.isChecked = this.form.value.has_membership === ProgramMembership.enabled;
    }

    if (this.todo) {
      const _self = this;
      this.dueDate = {
        ...COMMON_DATE_PICKER_OPTIONS,
        defaultDate: CPDate.fromEpoch(this.todo.due_date),
        onClose: function(date) {
          _self.form.controls['due_date'].setValue(CPDate.toEpoch(date[0]));
        },
      };
    }
  }
}
