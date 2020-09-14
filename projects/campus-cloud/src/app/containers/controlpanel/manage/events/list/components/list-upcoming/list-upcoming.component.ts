import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  canAccountLevelReadResource,
  canSchoolWriteResource
} from '@campus-cloud/shared/utils/privileges/privileges';

import { CPSession } from '@campus-cloud/session';
import { FORMAT } from '@campus-cloud/shared/pipes';
import { CP_TRACK_TO } from '@campus-cloud/shared/directives/tracking';
import {
  CPI18nService,
  CPTrackingService
} from '@campus-cloud/shared/services';
import {
  amplitudeEvents,
  CP_PRIVILEGES_MAP
} from '@campus-cloud/shared/constants';
import { EventsAmplitudeService } from '@controlpanel/manage/events/events.amplitude.service';
import { EventAttendance } from '@controlpanel/manage/events/event.status';
import { EventUtilService } from '@controlpanel/manage/events/events.utils.service';
import IEvent from '@controlpanel/manage/events/event.interface';

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

  canDelete;
  eventData;
  sortingLabels;
  eventCheckinRoute;
  sort: ISort = sort;
  dateFormat = FORMAT.SHORT;
  attendanceEnabled = EventAttendance.enabled;
  isExternalToolTip = this.cpI18n.translate('t_events_list_external_source_tooltip');

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public utils: EventUtilService,
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

    this.cpTracking.amplitudeEmitEvent(amplitudeEvents.DELETED_ITEM, eventProperties);
  }

  setEventProperties() {
    return {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.UPCOMING_EVENT
    };
  }

  trackKioskCheckinEvent(event: IEvent) {
    this.trackCheckinEvent(event, amplitudeEvents.MANAGE_CC_KIOSK_CHECK_IN);
  }

  trackSelfCheckinEvent(event: IEvent) {
    this.trackCheckinEvent(event, amplitudeEvents.MANAGE_CC_SELF_CHECK_IN);
  }

  trackCheckinEvent(event: IEvent, eventType: string) {
    const menus = this.cpTracking.getAmplitudeMenuProperties();
    const eventProperties = {
      source_id: event.encrypted_id,
      sub_menu_name: menus['sub_menu_name'],
      assessment_type: EventsAmplitudeService.getEventCategoryType(event.store_category)
    };

    this.cpTracking.amplitudeEmitEvent(eventType, eventProperties);
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

  displaySelfCheckInLink({ attend_verification_methods }) {
    return this.utils.displaySelfCheckInLink({attend_verification_methods});
  }
}
