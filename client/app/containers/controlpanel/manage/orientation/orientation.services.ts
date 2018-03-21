import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';
import { CPSession } from '../../../../session';

@Injectable()
export class OrientationService extends BaseService {
  dummy;
  search = new URLSearchParams();
  mockJson = require('./mockEvents.json');

  constructor(http: Http, router: Router, session: CPSession) {
    super(http, router);

    Object.setPrototypeOf(this, OrientationService.prototype);

    this.search.append('school_id', session.g.get('school').id);
  }

  // programs
  getPrograms(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getProgramById(programId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${programId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createProgram(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editProgram(programId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${programId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  deleteProgram(programId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.ORIENTATION
      }/${programId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  duplicateProgram(programId: number, body: any, search: URLSearchParams) {
    this.dummy = [programId, body, search];

    return Observable.of(body).delay(300);
  }

  // events
  getEvents(startRage: number, endRage: number, search?: URLSearchParams) {
    this.dummy = [startRage, endRage, search];

    return Observable.of(this.mockJson).delay(300);
  }

  createEvent(body: any) {
    const search = this.search;
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.ORIENTATION_EVENTS}/`;

    return super.post(url, body, {search}).map((res) => res.json());
  }

  updateEvent(body: any, eventId: number) {
    this.dummy = [body, eventId];

    return Observable.of(body).delay(300);
  }

  getEventById(id: number) {
    const event = this.mockJson.filter((item) => item.id.toString() === id);

    return Observable.of(event[0]).delay(300);
  }

  deleteEventById(eventId: number) {
    const events = this.mockJson.filter((item) => item.id.toString() !== eventId);

    return Observable.of(events).delay(300);
  }

  getEventAttendanceByEventId(
    startRage: number,
    endRage: number,
    search?: URLSearchParams,
  ) {
    this.dummy = [startRage, endRage, search];

    return Observable.of([]).delay(300);
  }
}
