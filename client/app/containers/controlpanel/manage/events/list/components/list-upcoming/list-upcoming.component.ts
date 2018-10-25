import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  canSchoolWriteResource,
  canAccountLevelReadResource
} from './../../../../../../../shared/utils/privileges/privileges';

import { EventAttendance } from '../../../event.status';
import { FORMAT } from '../../../../../../../shared/pipes';
import { CPSession } from './../../../../../../../session/index';
import { EventUtilService } from '../../../events.utils.service';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService, RouteLevel } from '../../../../../../../shared/services';

interface ISort {
  sort_field: string;
  sort_direction: string;
}

const sort = {
  sort_field: 'title', // title, start, end
  sort_direction: 'asc' // asc, desc
};

@Component({
  selector: 'cp-list-upcoming',
  templateUrl: './list-upcoming.component.html',
  styleUrls: ['./list-upcoming.component.scss']
})
export class ListUpcomingComponent implements OnInit {
  @Input() state: any;
  @Input() events: any;
  @Input() isClub: boolean;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() isOrientation: boolean;

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<ISort> = new EventEmitter();

  sort: ISort = sort;
  canDelete;
  eventData;
  sortingLabels;
  eventCheckinRoute;
  dateFormat = FORMAT.SHORT;
  attendanceEnabled = EventAttendance.enabled;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private utils: EventUtilService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete(event) {
    this.deleteEvent.emit(event);
    this.trackDeleteEvent();
  }

  doSort(sort_field) {
    const sort_direction = this.state.sort_direction === 'asc' ? 'desc' : 'asc';

    this.sort = Object.assign({}, this.sort, { sort_field, sort_direction });

    this.sortList.emit(this.sort);
  }

  trackDeleteEvent() {
    const eventProperties = this.setEventProperties();
    delete eventProperties['page_type'];

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      eventProperties
    );
  }

  setEventProperties() {
    return {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth),
      page_type: amplitudeEvents.UPCOMING_EVENT
    };
  }

  trackCheckinEvent(event_id) {
    const source_page = this.utils.getCheckinSourcePage(
      this.isAthletic,
      this.isService,
      this.isClub,
      this.isOrientation
    );

    const eventProperties = {
      event_id,
      source_page
    };

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.MANAGE_CLICKED_CHECKIN, eventProperties);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.setEventProperties()
    };

    this.eventCheckinRoute = this.utils.getEventCheckInLink(this.isOrientation);
    const scholAccess = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const accountAccess = canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    this.canDelete = scholAccess || accountAccess || this.isOrientation;

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      start_date: this.cpI18n.translate('start_date')
    };
  }
}
