import { PersonasType } from './../../../personas.status';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../../shared/services';

@Component({
  selector: 'cp-personas-list-action-box',
  templateUrl: './list-action-box.component.html',
  styleUrls: ['./list-action-box.component.scss']
})
export class PersonasListActionBoxComponent implements OnInit {
  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() filterBy: EventEmitter<null> = new EventEmitter();

  eventData;
  dropdownItems;

  constructor(public cpI18n: CPI18nService, public cpTracking: CPTrackingService) {}

  onSearch(query) {
    this.search.emit(query);
  }

  onSelectedFilter({ id }) {
    this.filterBy.emit(id);
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.dropdownItems = [
      {
        id: null,
        label: this.cpI18n.translate('t_personas_list_dropdown_all_experiences')
      },
      {
        id: PersonasType.mobile,
        label: this.cpI18n.translate('t_personas_list_dropdown_mobile_experiences')
      },
      {
        id: PersonasType.web,
        label: this.cpI18n.translate('t_personas_list_dropdown_web_experiences')
      }
    ];
  }
}
