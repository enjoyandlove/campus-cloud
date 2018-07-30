import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  canSchoolWriteResource,
  canAccountLevelReadResource
} from './../../../../../../../shared/utils/privileges/privileges';

import { FORMAT } from '../../../../../../../shared/pipes';
import { CPSession } from './../../../../../../../session/index';
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
  selector: 'cp-list-past',
  templateUrl: './list-past.component.html',
  styleUrls: ['./list-past.component.scss']
})
export class ListPastComponent implements OnInit {
  @Input() state: any;
  @Input() events: any;
  @Input() isOrientation: boolean;

  @Output() deleteEvent: EventEmitter<any> = new EventEmitter();
  @Output() sortList: EventEmitter<ISort> = new EventEmitter();

  sortingLabels;
  sort: ISort = sort;
  canDelete = false;
  dateFormat = FORMAT.SHORT;

  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService
  ) {}

  onDelete(event) {
    this.deleteEvent.emit(event);
    this.trackDeleteEvent();
  }

  trackViewEvent() {
    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.setEventProperties()
    };
  }

  trackDeleteEvent() {
    this.cpTracking.amplitudeEmitEvent(
      amplitudeEvents.DELETED_ITEM,
      this.setEventProperties());
  }

  setEventProperties() {
    return {
      ...this.cpTracking.getEventProperties(),
      page_name: this.cpTracking.activatedRoute(RouteLevel.fourth),
      page_type: amplitudeEvents.PAST_EVENT
    };
  }

  doSort(sort_field) {
    const sort_direction = this.state.sort_direction === 'asc' ? 'desc' : 'asc';

    this.sort = Object.assign({}, this.sort, { sort_field, sort_direction });

    this.sortList.emit(this.sort);
  }

  ngOnInit() {
    const scholAccess = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.events);
    const accountAccess = canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.events);
    this.canDelete = scholAccess || accountAccess || this.isOrientation;

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      end_date: this.cpI18n.translate('end_date')
    };
  }
}
