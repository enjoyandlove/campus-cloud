import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPSession } from './../../../../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../../../../shared/constants';
import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { canSchoolWriteResource } from './../../../../../../../shared/utils/privileges/privileges';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

interface IState {
  search_text: string;
  attendance_only: number;
}

const state = {
  search_text: null,
  attendance_only: 0
};

declare var $: any;

@Component({
  selector: 'cp-services-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class ServicesListActionBoxComponent implements OnInit {
  @Output() listAction: EventEmitter<IState> = new EventEmitter();

  loading;
  amplitudeEvents;
  canWriteSchoolWide;
  state: IState = state;

  constructor(private session: CPSession, private cpTracking: CPTrackingService) {}

  onSearch(search_text): void {
    this.state = Object.assign({}, this.state, { search_text });
    this.listAction.emit(this.state);
  }

  onAttendanceToggle(attendance_only) {
    attendance_only = attendance_only ? 1 : 0;
    this.state = Object.assign({}, this.state, { attendance_only });

    this.listAction.emit(this.state);
  }

  launchModal() {
    $('#excelServicesModal').modal();
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      create_page_name: amplitudeEvents.CREATE_SERVICE
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {
    this.amplitudeEvents = {
      clicked_create: amplitudeEvents.CLICKED_CREATE
    };

    this.canWriteSchoolWide = canSchoolWriteResource(this.session.g, CP_PRIVILEGES_MAP.services);
  }
}
