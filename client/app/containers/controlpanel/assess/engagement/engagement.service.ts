import { Http, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base/base.service';

@Injectable()
export class EngagementService extends BaseService {
  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, EngagementService.prototype);
  }

  getServices(startRange = 1, endRange = 1000, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.SERVICES}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }

  getLists(startRange = 1, endRange = 1000, search?: URLSearchParams) {
    const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.USER_LIST}`;
    const url = `${common}/${startRange};${endRange}`;

    return super.get(url, { search }).map(res => res.json());
  }


  // getUploadImageUrl() {
  //   return `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.IMAGE}/`;
  // }

  // getEventById(id: number) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${id}`;

  //   return super.get(url).map(res => res.json());
  // }

  // getEventsByHostId(hostId: string) {
  //   const search = new URLSearchParams();
  //   search.append('store_id', hostId);

  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}`;

  //   return super.get(url, { search }).map(res => res.json());
  // }

  // getEventAttendanceByEventId(startRage: number, endRage: number, search?: URLSearchParams) {
  //   const common = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT_ASSESMENT}`;
  //   const url = `${common}/${startRage};${endRage}`;

  //   return super.get(url, { search }).map(res => res.json());
  // }

  // setModalEvents(events: any[]): void {
  //   this.store.dispatch({
  //     type: EVENTS_MODAL_SET,
  //     payload: events
  //   });
  // }

  // createEvent(body: any) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/`;

  //   return super.post(url, body).map(res => res.json());
  // }

  // updateEvent(body: any, eventId: number) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

  //   return super.update(url, body).map(res => res.json());
  // }

  // deleteEventById(eventId: number) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.EVENT}/${eventId}`;

  //   return super.delete(url).map(res => res.json());
  // }

  // getFacebookEvents(search: URLSearchParams) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/`;

  //   return super.get(url, { search }).map(res => res.json());
  // }

  // createFacebookEvent(body, search: URLSearchParams) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/`;

  //   return super.post(url, body, { search }).map(res => res.json());
  // }

  // bulkUpdateFacebookEvents(events, search: URLSearchParams) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/`;

  //   return super.update(url, events, { search }).map(res => res.json());
  // }

  // deleteFacebookEventByLinkId(linkId: number, search: URLSearchParams) {
  //   const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.FB_EVENTS}/${linkId}`;

  //   return super.delete(url, { search }).map(res => res.json());
  // }
}
