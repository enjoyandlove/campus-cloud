import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Store } from '@ngrx/store';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

import { EVENTS_MODAL_SET } from '../../../../reducers/events-modal.reducer';

@Injectable()
export class EventsService extends BaseService {
  constructor(http: Http, private store: Store<any>) {
    super(http);

    Object.setPrototypeOf(this, EventsService.prototype);
  }

  getEvents(startRage: number, endRage: number, search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${startRage};${endRage}`;
    return super.get(url, { search }).map(res => res.json());
  }

  getUploadImageUrl() {
    return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  }

  getEventById(id: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${id}`;

    return super.get(url).map(res => res.json());
  }

  getEventsByHostId(hostId: string) {
    const search = new URLSearchParams();
    search.append('store_id', hostId);

    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getEventAttendanceByEventId(search?: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}/`;

    return super.get(url, { search }).map(res => res.json());
  }

  setModalEvents(events: any[]): void {
    this.store.dispatch({
      type: EVENTS_MODAL_SET,
      payload: events
    });
  }

  createEvent(body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/`;

    return super.post(url, body).map(res => res.json());
  }

  updateEvent(body: any) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/`;

    return super.update(url, body).map(res => res.json());
  }

  deleteEventById(eventId: number) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

    return super.delete(url).map(res => res.json());
  }
}
