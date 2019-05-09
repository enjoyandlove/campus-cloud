import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import IEvent from '../event.interface';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { EventsService } from '../events.service';

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  @Input() event: IEvent;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;
  @Output() deletedEvent: EventEmitter<number> = new EventEmitter();

  deleteWarnings = [this.cpI18n.translate('t_shared_delete_resource_warning_assessment_data')];

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    public service: EventsService
  ) {}

  onClose() {
    $('#deleteEventsModal').modal('hide');
  }

  onDelete() {
    let search = new HttpParams();
    if (this.orientationId) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.orientationId.toString());
    }

    this.service.deleteEventById(this.event.id, search).subscribe(() => {
      this.deletedEvent.emit(this.event.id);
      this.onClose();
    });
  }

  ngOnInit() {}
}
