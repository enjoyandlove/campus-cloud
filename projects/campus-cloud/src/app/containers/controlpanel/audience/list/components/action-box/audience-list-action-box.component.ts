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
  eventData;

  constructor(public cpI18n: CPI18nService, public cpTracking: CPTrackingService) {}

  onListSelected(selected) {
    this.filterBy.emit(selected.action);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getAmplitudeMenuProperties()
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
