import { Component, Inject, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { CPSession } from '@app/session';
import { EventsService } from '../events.service';
import { amplitudeEvents } from '@shared/constants';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { CPI18nService, CPTrackingService, IModal, MODAL_DATA } from '@shared/services';

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  deleteWarnings = [this.cpI18n.translate('t_shared_delete_resource_warning_assessment_data')];

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    private cpI18n: CPI18nService,
    public service: EventsService,
    public cpTrackingService: CPTrackingService
  ) {}

  onClose() {
    this.modal.onClose();
  }

  onDelete() {
    const eventId = this.modal.data.event.id;
    let search = new HttpParams();
    if (this.modal.data.orientation_id) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.modal.data.orientation_id.toString());
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
