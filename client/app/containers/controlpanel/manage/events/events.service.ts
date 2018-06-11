import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { HTTPService } from '../../../../base/http.service';
import { EVENTS_MODAL_SET } from '../../../../reducers/events-modal.reducer';

@Injectable()
export class EventsService extends HTTPService {
  constructor(http: HttpClient, router: Router, private store: Store<any>) {
    super(http, router);

    Object.setPrototypeOf(this, EventsService.prototype);
  }

  getEvents(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getEventById(id: number, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${id}`;

    return super.get(url);
  }

  getEventsByHostId(hostId: string) {
    const search = new HttpParams().append('store_id', hostId);

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}`;

    return super.get(url, search);
  }

  getEventAttendanceByEventId(startRage: number, endRage: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}`;
    const url = `${common}/${startRage};${endRage}`;

    return super.get(url, search);
  }

  setModalEvents(events: any[]): void {
    this.store.dispatch({
      type: EVENTS_MODAL_SET,
      payload: events
    });
  }

  createEvent(body: any, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/`;

    return super.post(url, body);
  }

  updateEvent(body: any, eventId: number, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

    return super.update(url, body);
  }

  deleteEventById(eventId: number, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

    return super.delete(url);
  }

  getFacebookEvents(search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/`;

    return super.get(url, search);
  }

  createFacebookEvent(body, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/`;

    return super.post(url, body, search);
  }

  bulkUpdateFacebookEvents(events, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/`;

    return super.update(url, events, search);
  }

  deleteFacebookEventByLinkId(linkId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/${linkId}`;

    return super.delete(url, search);
  }
}
