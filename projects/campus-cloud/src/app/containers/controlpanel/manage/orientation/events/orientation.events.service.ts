import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { ApiService } from '@campus-cloud/base';
import { baseActions } from '@campus-cloud/store/base';
import { EventsService } from '../../events/events.service';

@Injectable()
export class OrientationEventsService extends EventsService {
  constructor(public api: ApiService, private stores: Store<any>) {
    super(stores, api);
  }

  getEvents(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS}/${startRage};${endRage}`;

    return this.api.get(url, search, true);
  }

  createEvent(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS}/`;

    return this.api.post(url, body, search, true);
  }

  updateEvent(body: any, eventId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return this.api.update(url, body, search, true);
  }

  getEventById(id: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS}/${id}`;

    return this.api.get(url, search, true);
  }

  deleteEventById(eventId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return this.api.delete(url, search, true);
  }

  getEventAttendanceByEventId(startRage: number, endRage: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}`;
    const url = `${common}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  addEventCheckIn(body: any, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/`;

    return this.api.post(url, body, search);
  }

  updateEventCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/${attendeeId}`;

    return this.api.update(url, body, search);
  }

  deleteEventCheckInById(attendeeId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/${attendeeId}`;

    return this.api.delete(url, search);
  }

  setModalEvents(events: any[]): void {
    this.stores.dispatch({
      type: baseActions.EVENTS_MODAL_SET,
      payload: events
    });
  }
}
