import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import IEvent from '../event.interface';
import { CPSession } from '@app/session';
import { EventsService } from '../events.service';
import { amplitudeEvents } from '@shared/constants';
import { CPI18nService, CPTrackingService } from '@shared/services';
import { EventsAmplitudeService } from '../events.amplitude.service';

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
    public service: EventsService,
    public cpTrackingService: CPTrackingService
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
      this.trackDeletedEvent();
      this.onClose();
    });
  }

  trackDeletedEvent() {
    const eventProperties = {
      event_id: this.event.id,
      creation_source: EventsAmplitudeService.getEventType(this.event.is_external),
      ...EventsAmplitudeService.getEventProperties(this.event)
    };

    this.cpTrackingService.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_EVENT,
      eventProperties
    );
  }

  ngOnInit() {}
}
