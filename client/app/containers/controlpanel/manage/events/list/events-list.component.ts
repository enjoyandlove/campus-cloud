import { Component, OnInit } from '@angular/core';

import { CPSession } from '@app/session';
import { EventsService } from '../events.service';
import { CPI18nService } from '@shared/services/index';
import { ManageHeaderService } from '../../utils/header';
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
    public cpI18n: CPI18nService,
    public service: EventsService,
    private headerService: ManageHeaderService
  ) {
    super(session, cpI18n, service);
  }

  ngOnInit() {
    this.headerService.updateHeader();
  }
}
