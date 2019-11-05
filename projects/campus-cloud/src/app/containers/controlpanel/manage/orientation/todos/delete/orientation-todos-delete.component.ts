import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TodosService } from './../todos.service';
import { HttpParams } from '@angular/common/http';

import { ITodo } from '../todos.interface';
import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPTrackingService, CPI18nService } from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-orientation-todos-delete',
  templateUrl: './orientation-todos-delete.component.html',
  styleUrls: ['./orientation-todos-delete.component.scss']
})
export class OrientationTodosDeleteComponent implements OnInit {
  @Input() todo: ITodo;
  @Output() deleted: EventEmitter<number> = new EventEmitter();
  @Output() resetDeleteModal: EventEmitter<null> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: TodosService,
    public cpTracking: CPTrackingService
  ) {}

  onDelete() {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    this.service.deleteTodo(this.todo.id, search).subscribe(() => {
      this.trackEvent();
      this.deleted.emit(this.todo.id);
      this.resetDeleteModal.emit();
      $('#todoDelete').modal('hide');

      this.buttonData = Object.assign({}, this.buttonData, {
        disabled: false
      });
    });
  }

  trackEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.cpTracking.getAmplitudeMenuProperties()
    );
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
