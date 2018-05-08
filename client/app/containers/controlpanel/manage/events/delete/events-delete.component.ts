import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { CPI18nService } from '../../../../../shared/services';

declare var $: any;

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  @Input() event: any;
  @Input() orientationId: number;
  @Input() isOrientation: boolean;
  @Output() deletedEvent: EventEmitter<number> = new EventEmitter();

  buttonData;

  constructor(
    public session: CPSession,
    private cpI18n: CPI18nService,
    public service: EventsService
  ) {}

  onDelete() {
    const search = new HttpParams();
    if (this.orientationId) {
      search.append('school_id', this.session.g.get('school').id);
      search.append('calendar_id', this.orientationId.toString());
    }

    this.service.deleteEventById(this.event.id, search).subscribe(() => {
      this.deletedEvent.emit(this.event.id);

      $('#deleteEventsModal').modal('hide');

      this.buttonData = Object.assign({}, this.buttonData, { disabled: false });
    });
  }

  ngOnInit() {
    this.buttonData = {
      text: this.cpI18n.translate('delete'),
      class: 'danger'
    };
  }
}
