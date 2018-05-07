import { URLSearchParams, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';
import { IItem } from './items/item.interface';

@Injectable()
export class CalendarsService extends BaseService {
  modalItems: IItem[] = [];

  constructor(http: Http, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, CalendarsService.prototype);
  }

  setItems(items: string) {
    this.modalItems = JSON.parse(items);
  }

  getItems(): Observable<IItem[]> {
    const res = this.modalItems.length ? this.modalItems : [];

    return Observable.of(res);
  }

  getCalendars(startRage: number, endRage: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDARS
    }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  deleteCalendar(calendarId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDARS
    }/${calendarId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  createCalendar(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDARS}/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editCalendar(calendarId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDARS
    }/${calendarId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }

  delteItemById(itemId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDAR_ITEMS
    }/${itemId}`;

    return super.delete(url, { search }).map((res) => res.json());
  }

  getCalendarById(calendarId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDARS
    }/${calendarId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getItemsByCalendarId(
    startRage: number,
    endRage: number,
    search: URLSearchParams,
  ) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDAR_ITEMS
    }/${startRage};${endRage}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  getItemById(itemId: number, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDAR_ITEMS
    }/${itemId}`;

    return super.get(url, { search }).map((res) => res.json());
  }

  createItem(body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDAR_ITEMS
    }/`;

    return super.post(url, body, { search }).map((res) => res.json());
  }

  editItem(itemId: number, body: any, search: URLSearchParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDAR_ITEMS
    }/${itemId}`;

    return super.update(url, body, { search }).map((res) => res.json());
  }
}
