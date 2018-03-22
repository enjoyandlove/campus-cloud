import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { EventsService } from '../events.service';
import { CPSession } from '../../../../../session';
import { ManageHeaderService } from '../../utils/header';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';

import { EventsComponent } from './base/events.component';
import { CPI18nService } from '../../../../../shared/services/index';
import { OrientationEventsService } from '../../orientation/events/orientation.events.service';

@Component({
  selector: 'cp-events-list',
  templateUrl: './base/events.component.html',
  styleUrls: ['./base/events.component.scss'],
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
    public service: EventsService,
    public cpI18n: CPI18nService,
    private headerService: ManageHeaderService,
    public orientationEventService: OrientationEventsService,
  ) {
    super(session, cpI18n, service, orientationEventService);
  }

  private buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges(),
    });
  }

  ngOnInit() {
    this.buildHeader();
  }
}
