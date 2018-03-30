import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../../config/api';
import { CPSession } from '../../../../../session';
import { EventsService } from '../../events/events.service';
import { EVENTS_MODAL_SET } from '../../../../../reducers/events-modal.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class OrientationEventsService extends EventsService {
  dummy;
  search = new URLSearchParams();
  mockJson = require('./mockEvents.json');

  constructor(http: Http, router: Router, private stores: Store<any>, session: CPSession) {
    super(http, router, stores);

    Object.setPrototypeOf(this, OrientationEventsService.prototype);

    this.search.append('school_id', session.g.get('school').id);
  }

  getEvents(startRage: number, endRage: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION_EVENTS
      }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createEvent(body: any) {
    const search = this.search;
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/`;

    return super.post(url, body, {search}).map((res) => res.json());
  }

  updateEvent(body: any, eventId: number) {
    const search = this.search;
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return super.update(url, body, {search}).map((res) => res.json());
  }

  getEventById(id: number) {
    const search = this.search;
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${id}`;

    return super.get(url, {search}).map((res) => res.json());
  }

  deleteEventById(eventId: number) {
    const search = this.search;
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/${eventId}`;

    return super.delete(url, {search}).map((res) => res.json());
  }

  getEventAttendanceByEventId(
    startRage: number,
    endRage: number,
    search?: URLSearchParams,
  ) {
    this.dummy = [startRage, endRage, search];

    return Observable.of([]).delay(300);
  }

  setModalEvents(events: any[]): void {
    this.stores.dispatch({
      type: EVENTS_MODAL_SET,
      payload: events,
    });
  }
}
