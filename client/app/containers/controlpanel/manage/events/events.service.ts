import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { API } from '@app/config/api';
import { baseActions } from '@app/store/base';
import { HTTPService } from '@app/base/http.service';

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

    return super.get(url, search, true).pipe(
      catchError((err) => {
        if (err.status === 403) {
          return of(new HttpResponse({ body: JSON.stringify([]) }));
        }
        return err;
      })
    );
  }

  getEventAttendanceSummary(eventId: number, search?: HttpParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}`;
    const url = `${common}/${eventId}`;

    return super.get(url, search);
  }

  setModalEvents(events: any[]): void {
    this.store.dispatch({
      type: baseActions.EVENTS_MODAL_SET,
      payload: events
    });
  }

  createEvent(body: any, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/`;

    return super.post(url, body, null, true);
  }

  updateEvent(body: any, eventId: number, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

    return super.update(url, body);
  }

  deleteEventById(eventId: number, {}) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

    return super.delete(url);
  }

  addCheckIn(body: any, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}/`;

    return super.post(url, body, search);
  }

  addOrientationCheckIn(body: any, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/`;

    return super.post(url, body, search);
  }

  updateCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}/${attendeeId}`;

    return super.update(url, body, search);
  }

  updateOrientationCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT
    }/${attendeeId}`;

    return super.update(url, body, search);
  }

  deleteCheckInById(attendeeId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}/${attendeeId}`;

    return super.delete(url, search);
  }

  deleteOrientationCheckInById(attendeeId: number, search?: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT
    }/${attendeeId}`;

    return super.delete(url, search);
  }
}
