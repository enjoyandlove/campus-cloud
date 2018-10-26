import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  canSchoolWriteResource,
  canAccountLevelReadResource
} from './../../../../../../../shared/utils/privileges/privileges';

import { EventAttendance } from '../../../event.status';
import { EventsService } from '../../../events.service';
import { FORMAT } from '../../../../../../../shared/pipes';
import { CPSession } from './../../../../../../../session';
import { EventsComponent } from '../../base/events.component';
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
export class ListUpcomingComponent extends EventsComponent implements OnInit {
  @Input() state: any;
  @Input() events: any;
  @Input() isClub: boolean;
  @Input() isService: boolean;
  @Input() isAthletic: boolean;
  @Input() isOrientation: boolean;

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<ISort> = new EventEmitter();

  canDelete;
  eventData;
  sortingLabels;
  checkInSource;
  eventCheckinRoute;
  sort: ISort = sort;
  dateFormat = FORMAT.SHORT;
  attendanceEnabled = EventAttendance.enabled;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: EventsService,
    public utils: EventUtilService,
    private cpTracking: CPTrackingService
  ) {
    super(session, cpI18n, service);
  }

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

  trackCheckinEvent(source_id) {
    const eventProperties = {
      source_id,
      check_in_type: this.checkInSource.check_in_type,
      check_in_source: amplitudeEvents.UPCOMING_EVENT,
      sub_menu_name: this.cpTracking.activatedRoute(RouteLevel.second)
    };

    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.MANAGE_CLICKED_WEB_CHECK_IN,
      eventProperties
    );
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.setEventProperties()
    };

    this.checkInSource = this.utils.getCheckinSourcePage(this.getEventType());

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
