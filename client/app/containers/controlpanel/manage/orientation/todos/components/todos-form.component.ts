import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CPDate } from '../../../../../../shared/utils';
import { ITodo } from '../../../orientation/todos/todos.interface';

const FORMAT_WITH_TIME = 'F j, Y h:i K';

const COMMON_DATE_PICKER_OPTIONS = {
  altInput: true,
  enableTime: true,
  altFormat: FORMAT_WITH_TIME,
};

@Component({
  selector: 'cp-todos-form',
  templateUrl: './todos-form.component.html',
  styleUrls: ['./todos-form.component.scss']
})
export class TodosFormComponent implements OnInit {
  @Input() todo: ITodo;
  @Input() form: FormGroup;

  @Output()
  submitted: EventEmitter<{
    name: string;
    description: string;
  }> = new EventEmitter();

  dueDate;

  constructor() {}

  ngOnInit() {
    const _self = this;
    this.dueDate = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: CPDate.fromEpoch(this.form.controls['due_date'].value),
      onClose: function(_, dateStr) {
        _self.form.controls['due_date'].setValue(CPDate.toEpoch(dateStr));
      },
    };
  }
}
