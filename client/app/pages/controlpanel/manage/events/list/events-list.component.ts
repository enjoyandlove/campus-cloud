import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

import { EventsComponent } from './base/events.component';

interface IState {
  start: number;
  end: number;
  store_id: number;
  attendance_only: number;
  sort_field: string;
  sort_direction: string;
  events: any[];
}

const state = {
  start: null,
  end: null,
  store_id: null,
  attendance_only: 0,
  sort_field: 'start',
  sort_direction: 'asc',
  events: []
};

@Component({
  selector: 'cp-events-list',
  templateUrl: './base/events.component.html',
  styleUrls: ['./base/events.component.scss']
})
export class EventsListComponent extends EventsComponent implements OnInit {
  events;
  loading;
  pageNext;
  pagePrev;
  pageNumber;
  isUpcoming;
  deleteEvent = '';
  state: IState = state;

  constructor(
    private store: Store<IHeader>,
    public service: EventsService
  ) {
    super(service);
    this.buildHeader();
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: require('../../manage.header.json')
    });
  }

  ngOnInit() { }
}
