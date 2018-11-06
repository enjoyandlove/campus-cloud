import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CPSession } from '../../../../../../session';
import { CPDate } from '../../../../../../shared/utils';
import { ITodo } from '../../../orientation/todos/todos.interface';

const COMMON_DATE_PICKER_OPTIONS = {
  enableTime: true
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
    title: string;
    description: string;
  }> = new EventEmitter();

  dueDate;

  constructor(private session: CPSession) {}

  setEnd(date) {
    this.form.controls['end'].setValue(CPDate.toEpoch(date, this.session.tz));
  }

  ngOnInit() {
    const _self = this;
    const due_date = this.form.controls['end'].value;
    this.dueDate = {
      ...COMMON_DATE_PICKER_OPTIONS,
      defaultDate: due_date
        ? CPDate.fromEpoch(this.form.controls['end'].value, _self.session.tz).format()
        : null
    };
  }
}
