import { URLSearchParams, Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { EventsService } from '../../events/events.service';
import { EVENTS_MODAL_SET } from '../../../../../reducers/events-modal.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class OrientationEventsService extends EventsService {
  constructor(http: Http, router: Router, private stores: Store<any>) {
    super(http, router, stores);

    Object.setPrototypeOf(this, OrientationEventsService.prototype);
  }

  getEvents(startRage: number, endRage: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS
      }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createEvent(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/`;

    return super.post(url, body, {search}).map((res) => res.json());
  }

  updateEvent(body: any, eventId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return super.update(url, body, {search}).map((res) => res.json());
  }

  getEventById(id: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${id}`;

    return super.get(url, {search}).map((res) => res.json());
  }

  deleteEventById(eventId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return super.delete(url, {search}).map((res) => res.json());
  }

  getEventAttendanceByEventId(
    startRage: number,
    endRage: number,
    search?: URLSearchParams,
  ) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT
      }`;
    const url = `${common}/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  setModalEvents(events: any[]): void {
    this.stores.dispatch({
      type: EVENTS_MODAL_SET,
      payload: events,
    });
  }
}
