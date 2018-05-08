import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';

import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CPSession } from './../../../../../../session';
import { TodosService } from '../todos.service';
import { CPI18nService } from '../../../../../../shared/services/i18n.service';
import { ITodo } from '../todos.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'cp-orientation-todo-create',
  templateUrl: './orientation-todos-create.component.html',
  styleUrls: ['./orientation-todos-create.component.scss']
})
export class OrientationTodosCreateComponent implements OnInit {
  @ViewChild('createForm') createForm;

  @Output() created: EventEmitter<ITodo> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  orientationId: number;

  constructor(
    public el: ElementRef,
    public fb: FormBuilder,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TodosService,
    public route: ActivatedRoute
  ) {}

  @HostListener('document:click', ['$event'])
  onClick(event) {
    // out of modal reset form
    if (event.target.contains(this.el.nativeElement)) {
      this.resetModal();
    }
  }

  resetModal() {
    this.resetCreateModal.emit();
    this.createForm.form.reset();
    $('#todoCreate').modal('hide');
  }

  onSubmit() {
    const search = new HttpParams();
    search.append('school_id', this.session.g.get('school').id);
    search.append('calendar_id', this.orientationId.toString());

    this.service.createTodo(this.form.value, search).subscribe((createdTodo) => {
      this.created.emit(createdTodo);
      this.resetModal();
    });
  }

  ngOnInit() {
    this.orientationId = this.route.snapshot.parent.parent.params['orientationId'];
    this.form = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(225)]],
      description: [null, Validators.maxLength(512)],
      end: [null, Validators.required]
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
