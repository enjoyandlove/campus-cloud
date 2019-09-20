import {
  OnInit,
  Output,
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  HostListener
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ITodo } from '../todos.interface';
import { TodosService } from '../todos.service';
import { CPSession } from '@campus-cloud/session';
import { CPI18nService } from '@campus-cloud/shared/services';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

@Mixin([Destroyable])
@Component({
  selector: 'cp-orientation-todo-create',
  templateUrl: './orientation-todos-create.component.html',
  styleUrls: ['./orientation-todos-create.component.scss']
})
export class OrientationTodosCreateComponent implements OnInit, OnDestroy {
  @ViewChild('createForm', { static: true }) createForm;

  @Output() created: EventEmitter<ITodo> = new EventEmitter();
  @Output() resetCreateModal: EventEmitter<null> = new EventEmitter();

  buttonData;
  form: FormGroup;
  orientationId: number;

  destroy$ = new Subject<null>();
  emitDestroy() {}

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
    const search = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('calendar_id', this.orientationId.toString());

    this.service.createTodo(this.form.value, search).subscribe((createdTodo: any) => {
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

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.buttonData = { ...this.buttonData, disabled: !this.form.valid };
    });
  }

  ngOnDestroy() {
    this.emitDestroy();
  }
}
