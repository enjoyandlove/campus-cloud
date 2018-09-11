import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { EventsService } from '../../events/events.service';
import { EVENTS_MODAL_SET } from '../../../../../reducers/events-modal.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class OrientationEventsService extends EventsService {
  constructor(http: HttpClient, router: Router, private stores: Store<any>) {
    super(http, router, stores);

    Object.setPrototypeOf(this, OrientationEventsService.prototype);
  }

  getEvents(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS
    }/${startRage};${endRage}`;

    return super.get(url, search);
  }

  createEvent(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/`;

    return super.post(url, body, search);
  }

  updateEvent(body: any, eventId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return super.update(url, body, search);
  }

  getEventById(id: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${id}`;

    return super.get(url, search);
  }

  deleteEventById(eventId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return super.delete(url, search);
  }

  getEventAttendanceByEventId(startRage: number, endRage: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT
    }`;
    const url = `${common}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  addEventCheckIn(body: any, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/`;

    return super.post(url, body, search);
  }

  updateEventCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/${attendeeId
    }`;

    return super.update(url, body, search);
  }

  deleteEventCheckInById(attendeeId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/${attendeeId
    }`;

    return super.delete(url, search);
  }

  setModalEvents(events: any[]): void {
    this.stores.dispatch({
      type: EVENTS_MODAL_SET,
      payload: events
    });
  }
}
