import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ITodo } from '../todos.interface';
import { TodosService } from '../todos.service';
import { CPSession } from './../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';

@Component({
  selector: 'cp-orientation-todos-edit',
  templateUrl: './orientation-todos-edit.component.html',
  styleUrls: ['./orientation-todos-edit.component.scss'],
})
export class OrientationTodosEditComponent implements OnInit {
  @ViewChild('editForm') editForm;

  @Input() todo: ITodo;

  @Output() edited: EventEmitter<ITodo> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  isTodo = true;
  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TodosService,
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetEditModal.emit();
    this.editForm.form.reset();
    $('#todoEdit').modal('hide');
  }

  onSubmit() {
    const search = new URLSearchParams();
    search.append('school_id', this.session.g.get('school').id);

    this.service
      .editTodo(this.todo.id, this.form.value, search)
      .subscribe((editedTodo) => {
         this.edited.emit(editedTodo);
         this.resetModal();
      });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.todo.id],
      name: [
        this.todo.name,
        [Validators.required, Validators.maxLength(225)],
      ],
      description: [
        this.todo.description,
        Validators.maxLength(512)
      ],
      due_date: [
        this.todo.due_date
      ],
    });

    this.buttonData = Object.assign({}, this.buttonData, {
      class: 'primary',
      disabled: !this.form.valid,
      text: this.cpI18n.translate('save')
    });

    this.form.valueChanges.subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }
}
