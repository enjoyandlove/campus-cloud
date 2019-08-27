import { HttpParams, HttpResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import { baseActions } from '@campus-cloud/store/base';
import { ApiService } from '@campus-cloud/base/services';

@Injectable()
export class EventsService {
  constructor(private store: Store<any>, public api: ApiService) {}

  getEvents(startRage: number, endRage: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}/${startRage};${endRage}`;

    return this.api.get(url, search, true);
  }

  getUploadImageUrl() {
    return `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.IMAGE}/`;
  }

  getEventById(id: number, {}) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}/${id}`;

    return this.api.get(url, null, true);
  }

  getEventsByHostId(hostId: string) {
    const search = new HttpParams().append('store_id', hostId);

    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}`;

    return this.api.get(url, search);
  }

  getEventAttendanceByEventId(startRage: number, endRage: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT_ASSESMENT}`;
    const url = `${common}/${startRage};${endRage}`;

    return this.api.get(url, search, true).pipe(
      catchError((err) => {
        if (err.status === 403) {
          return of(new HttpResponse({ body: JSON.stringify([]) }));
        }
        return err;
      })
    );
  }

  getEventAttendanceSummary(eventId: number, search?: HttpParams) {
    const common = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}`;
    const url = `${common}/${eventId}`;

    return this.api.get(url, search);
  }

  setModalEvents(events: any[]): void {
    this.store.dispatch({
      type: baseActions.EVENTS_MODAL_SET,
      payload: events
    });
  }

  createEvent(body: any, {}) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}/`;

    return this.api.post(url, body, null, true);
  }

  updateEvent(body: any, eventId: number, {}) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}/${eventId}`;

    return this.api.update(url, body, null, true);
  }

  deleteEventById(eventId: number, {}) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT}/${eventId}`;

    return this.api.delete(url, null, true);
  }

  addCheckIn(body: any, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT_ASSESMENT}/`;

    return this.api.post(url, body, search);
  }

  addOrientationCheckIn(body: any, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/`;

    return this.api.post(url, body, search);
  }

  updateCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT_ASSESMENT}/${attendeeId}`;

    return this.api.update(url, body, search);
  }

  updateOrientationCheckIn(body: any, attendeeId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/${attendeeId}`;

    return this.api.update(url, body, search);
  }

  deleteCheckInById(attendeeId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EVENT_ASSESMENT}/${attendeeId}`;

    return this.api.delete(url, search);
  }

  deleteOrientationCheckInById(attendeeId: number, search?: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.ORIENTATION_EVENTS_ASSESSMENT}/${attendeeId}`;

    return this.api.delete(url, search);
  }
}
