import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

import { EventsComponent } from './base/events.component';

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

  constructor(
    public session: CPSession,
    private store: Store<IHeader>,
    public service: EventsService
  ) {
    super(session, service);
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
