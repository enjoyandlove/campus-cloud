import { HttpClient, HttpParams } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { API } from '../../../../config/api';
import { BaseService } from '../../../../base';
import { IItem } from './items/item.interface';

@Injectable()
export class CalendarsService extends BaseService {
  modalItems: IItem[] = [];

  constructor(http: HttpClient, router: Router) {
    super(http, router);

    Object.setPrototypeOf(this, CalendarsService.prototype);
  }

  setItems(items: string) {
    this.modalItems = JSON.parse(items);
  }

  getItems(): Observable<IItem[]> {
    const res = this.modalItems.length ? this.modalItems : [];

    return observableOf(res);
  }

  getCalendars(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDARS
    }/${startRage};${endRage}`;

    return super.get(url, search);
  }

  deleteCalendar(calendarId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDARS}/${calendarId}`;

    return super.delete(url, search);
  }

  createCalendar(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDARS}/`;

    return super.post(url, body, search);
  }

  editCalendar(calendarId: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDARS}/${calendarId}`;

    return super.update(url, body, search);
  }

  delteItemById(itemId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDAR_ITEMS}/${itemId}`;

    return super.delete(url, search);
  }

  getCalendarById(calendarId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDARS}/${calendarId}`;

    return super.get(url, search);
  }

  getItemsByCalendarId(startRage: number, endRage: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${
      API.ENDPOINTS.CALENDAR_ITEMS
    }/${startRage};${endRage}`;

    return super.get(url, search);
  }

  getItemById(itemId: number, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDAR_ITEMS}/${itemId}`;

    return super.get(url, search);
  }

  createItem(body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDAR_ITEMS}/`;

    return super.post(url, body, search);
  }

  editItem(itemId: number, body: any, search: HttpParams) {
    const url = `${API.BASE_URL}/${API.VERSION.V1}/${API.ENDPOINTS.CALENDAR_ITEMS}/${itemId}`;

    return super.update(url, body, search);
  }
}
