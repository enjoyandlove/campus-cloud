import { of, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IItem } from './items/item.interface';
import { ApiService } from '@campus-cloud/base';

@Injectable()
export class CalendarsService {
  modalItems: IItem[] = [];

  constructor(private api: ApiService) {}

  setItems(items: string) {
    this.modalItems = JSON.parse(items);
  }

  getItems(): Observable<IItem[]> {
    const res = this.modalItems.length ? this.modalItems : [];

    return of(res);
  }

  getCalendars(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDARS}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  deleteCalendar(calendarId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDARS}/${calendarId}`;

    return this.api.delete(url, search);
  }

  createCalendar(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDARS}/`;

    return this.api.post(url, body, search);
  }

  editCalendar(calendarId: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDARS}/${calendarId}`;

    return this.api.update(url, body, search);
  }

  delteItemById(itemId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDAR_ITEMS}/${itemId}`;

    return this.api.delete(url, search);
  }

  getCalendarById(calendarId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDARS}/${calendarId}`;

    return this.api.get(url, search);
  }

  getItemsByCalendarId(startRage: number, endRage: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDAR_ITEMS}/${startRage};${endRage}`;

    return this.api.get(url, search);
  }

  getItemById(itemId: number, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDAR_ITEMS}/${itemId}`;

    return this.api.get(url, search);
  }

  createItem(body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDAR_ITEMS}/`;

    return this.api.post(url, body, search);
  }

  editItem(itemId: number, body: any, search: HttpParams) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.CALENDAR_ITEMS}/${itemId}`;

    return this.api.update(url, body, search);
  }
}
