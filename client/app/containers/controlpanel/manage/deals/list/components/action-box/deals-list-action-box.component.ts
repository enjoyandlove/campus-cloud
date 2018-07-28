import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { IDeal } from '../../../deals.interface';
import { DealsService } from '../../../deals.service';
import { CPTrackingService } from '../../../../../../../shared/services';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';

export interface IState {
  deals: Array<IDeal>;
  store_id: number;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state = {
  deals: [],
  store_id: null,
  search_str: null,
  sort_field: 'title',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-deals-action-box',
  templateUrl: './deals-list-action-box.component.html',
  styleUrls: ['./deals-list-action-box.component.scss']
})
export class DealsListActionBoxComponent implements OnInit {
  stores$;
  amplitudeEvents;
  state: IState = state;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() listAction: EventEmitter<any> = new EventEmitter();

  constructor(public dealsService: DealsService, public cpTracking: CPTrackingService) {}

  onFilterByStore(store_id) {
    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  onSearch(query) {
    this.search.emit(query);
  }

  trackEvent(eventName, page_type) {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_type
    };

    return {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName,
      eventProperties
    };
  }

  ngOnInit() {
    this.stores$ = this.dealsService.getDealStores();

    this.amplitudeEvents = {
      page_type: amplitudeEvents.STORE,
      clicked_create: amplitudeEvents.CLICKED_CREATE_ITEM,
      clicked_page_item: amplitudeEvents.CLICKED_PAGE_ITEM
    };
  }
}
