import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AudienceType } from './../../../audience.status';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../shared/services';
import { CP_TRACK_TO } from '../../../../../../shared/directives/tracking';

@Component({
  selector: 'cp-audience-list-action-box',
  templateUrl: './audience-list-action-box.component.html',
  styleUrls: ['./audience-list-action-box.component.scss']
})
export class AudienceListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filterBy: EventEmitter<number> = new EventEmitter();
  @Output() launchCreateModal: EventEmitter<null> = new EventEmitter();
  @Output() launchImportModal: EventEmitter<null> = new EventEmitter();

  listTypes;
  amplitudeEvents;

  constructor(
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService
  ) {}

  onListSelected(selected) {
    this.filterBy.emit(selected.action);
  }

  trackEvent(eventName) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(), create_page_name: amplitudeEvents.CREATE_LIST
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

    this.listTypes = [
      {
        label: this.cpI18n.translate('audience_type_all'),
        action: null
      },
      {
        label: this.cpI18n.translate('audience_type_custom'),
        action: AudienceType.custom
      },
      {
        label: this.cpI18n.translate('audience_type_dynamic'),
        action: AudienceType.dynamic
      }
    ];
  }
}
