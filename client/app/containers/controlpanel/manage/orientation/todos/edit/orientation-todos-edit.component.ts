import { HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CPSession } from './../../../../../../session';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { ITodo } from '../todos.interface';
import { TodosService } from '../todos.service';

@Component({
  selector: 'cp-orientation-todos-edit',
  templateUrl: './orientation-todos-edit.component.html',
  styleUrls: ['./orientation-todos-edit.component.scss']
})
export class OrientationTodosEditComponent implements OnInit {
  @ViewChild('editForm') editForm;

  @Input() todo: ITodo;

  @Output() edited: EventEmitter<ITodo> = new EventEmitter();
  @Output() resetEditModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TodosService
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
    const search = new HttpParams().append('school_id', this.session.g.get('school').id);

    this.service.editTodo(this.todo.id, this.form.value, search).subscribe((editedTodo: any) => {
      this.edited.emit(editedTodo);
      this.resetModal();
    });
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.todo.id],
      title: [this.todo.title, [Validators.required, Validators.maxLength(225)]],
      description: [this.todo.description, Validators.maxLength(512)],
      end: [this.todo.end, Validators.required]
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
