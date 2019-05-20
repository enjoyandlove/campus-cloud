import { Component, Inject, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@app/session';
import { EventsService } from '../events.service';
import { amplitudeEvents } from '@shared/constants';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { CPI18nService, CPTrackingService, IModal, MODAL_DATA } from '@shared/services';
import { OrientationEventsService } from '../../orientation/events/orientation.events.service';

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  service: EventsService | OrientationEventsService;
  deleteWarnings = [this.cpI18n.translate('t_shared_delete_resource_warning_assessment_data')];

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    private cpI18n: CPI18nService,
    public eventService: EventsService,
    public cpTrackingService: CPTrackingService,
    public orientationService: OrientationEventsService
  ) {}

  onClose() {
    this.modal.onClose();
  }

  onDelete() {
    let search = new HttpParams();
    const orientationId = this.modal.data.orientation_id;
    const eventId = this.modal.data.event.id;
    this.service = orientationId ? this.orientationService : this.eventService;

    if (orientationId) {
      search = search
        .append('calendar_id', orientationId.toString())
        .append('school_id', this.session.g.get('school').id);
    }

    this.service.deleteEventById(eventId, search).subscribe(() => {
      this.onClose();
      this.trackDeletedEvent();
      this.modal.onAction(eventId);
    });
  }

  trackDeletedEvent() {
    const eventProperties = {
      event_id: this.modal.data.event.id,
      ...EventsAmplitudeService.getEventProperties(this.modal.data.event)
    };

    this.cpTrackingService.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_EVENT,
      eventProperties
    );
  }

  ngOnInit() {}
}
