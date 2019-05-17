import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CPSession } from '@app/session';
import { CP_TRACK_TO } from '@shared/directives';
import { CPI18nService, CPTrackingService } from '@shared/services';
import { amplitudeEvents, CP_PRIVILEGES_MAP } from '@shared/constants';

interface IState {
  query: string;
  type: number;
}

const state: IState = {
  query: null,
  type: null
};

@Component({
  selector: 'cp-announcements-list-action-box',
  templateUrl: './announcements-list-action-box.component.html',
  styleUrls: ['./announcements-list-action-box.component.scss']
})
export class AnnouncementsListActionBoxComponent implements OnInit {
  @Output() filter: EventEmitter<IState> = new EventEmitter();

  types;
  eventData;
  canCompose;
  viewedFeedEventData;
  state: IState = state;
  constructor(
    private session: CPSession,
    private cpI18n: CPI18nService,
    private cpTracking: CPTrackingService
  ) {}

  onSearch(query) {
    this.state = Object.assign({}, this.state, { query });
    this.filter.emit(this.state);
  }

  onSelectedType(type) {
    this.state = Object.assign({}, this.state, { type: type.action });
    this.filter.emit(this.state);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.viewedFeedEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.MANAGE_VIEWED_FEED_INTEGRATION,
      eventProperties: { sub_menu_name: amplitudeEvents.ANNOUNCEMENT }
    };

    const schoolPrivilege = this.session.g.get('user').school_level_privileges[
      this.session.g.get('school').id
    ];

    this.canCompose = schoolPrivilege[CP_PRIVILEGES_MAP.campus_announcements].w;

    this.types = [
      {
        label: this.cpI18n.translate('all'),
        action: null
      },
      {
        label: this.cpI18n.translate('regular'),
        action: 2
      },
      {
        label: this.cpI18n.translate('urgent'),
        action: 1
      },
      {
        label: this.cpI18n.translate('emergency'),
        action: 0
      }
    ];
  }
}
