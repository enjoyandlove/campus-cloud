import { Component, Inject, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { EventsService } from '../events.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { baseActionClass, IHeader } from '@campus-cloud/store/base';
import { EventsAmplitudeService } from '../events.amplitude.service';
import { OrientationEventsService } from '../../orientation/events/orientation.events.service';
import {
  IModal,
  MODAL_DATA,
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';

@Component({
  selector: 'cp-events-delete',
  templateUrl: './events-delete.component.html',
  styleUrls: ['./events-delete.component.scss']
})
export class EventsDeleteComponent implements OnInit {
  service;
  deleteWarnings = [this.cpI18n.translate('t_shared_delete_resource_warning_assessment_data')];

  constructor(
    @Inject(MODAL_DATA) public modal: IModal,
    public session: CPSession,
    private cpI18n: CPI18nService,
    private store: Store<IHeader>,
    public eventService: EventsService,
    public cpTrackingService: CPTrackingService,
    public orientationService: OrientationEventsService
  ) {
    this.service = this.modal.data.orientation_id ? this.orientationService : this.eventService;
  }

  onClose() {
    this.modal.onClose();
  }

  onDelete() {
    let search = new HttpParams();
    const eventId = this.modal.data.event.id;

    if (this.modal.data.orientation_id) {
      search = search
        .append('school_id', this.session.g.get('school').id)
        .append('calendar_id', this.modal.data.orientation_id.toString());
    }

    this.service.deleteEventById(eventId, search).subscribe(
      () => {
        this.onClose();
        this.trackDeletedEvent();
        this.modal.onAction(eventId);
      },
      () => {
        this.onClose();
        this.handleError();
      }
    );
  }

  handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  trackDeletedEvent() {
    const eventProperties = {
      event_id: this.modal.data.event.id,
      creation_source: EventsAmplitudeService.getEventType(this.modal.data.event.is_external),
      ...EventsAmplitudeService.getEventProperties(this.modal.data.event)
    };

    this.cpTrackingService.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_DELETED_EVENT,
      eventProperties
    );
  }

  ngOnInit() {}
}
