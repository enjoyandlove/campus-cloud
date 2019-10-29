import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { startWith, map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { IDeal } from '../../../deals.interface';
import { DealsService } from '../../../deals.service';
import * as fromDeals from '../../../../../../../store/manage';
import { CP_TRACK_TO } from '../../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../../shared/constants/analytics';
import { CPTrackingService, CPI18nService } from '../../../../../../../shared/services';

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
  storeEventData;
  dealsEventData;
  state: IState = state;

  @Output() search: EventEmitter<string> = new EventEmitter();
  @Output() listAction: EventEmitter<any> = new EventEmitter();

  constructor(
    public cpI18n: CPI18nService,
    public dealsService: DealsService,
    public cpTracking: CPTrackingService,
    private store: Store<fromDeals.IDealsState>
  ) {}

  onFilterByStore(store_id) {
    this.state = Object.assign({}, this.state, { store_id });

    this.listAction.emit(this.state);
  }

  onSearch(query) {
    this.search.emit(query);
  }

  setEventProperties(page_type = null) {
    let properties = {
      ...this.cpTracking.getAmplitudeMenuProperties()
    };

    if (page_type) {
      properties = {
        ...properties,
        page_type
      };
    }

    return properties;
  }

  ngOnInit() {
    const dropdownLabel = this.cpI18n.translate('t_deals_list_dropdown_label_all_stores');
    this.stores$ = this.store.select(fromDeals.getDealsStores).pipe(
      startWith([{ label: dropdownLabel }]),
      map((stores) => [{ label: dropdownLabel, action: null }, ...stores])
    );

    this.store.select(fromDeals.getDealsLoaded).subscribe((loaded: boolean) => {
      if (!loaded) {
        this.store.dispatch(new fromDeals.LoadStores());
      }
    });

    this.storeEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_PAGE_ITEM,
      eventProperties: this.setEventProperties(amplitudeEvents.STORE)
    };

    this.dealsEventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.CLICKED_CREATE_ITEM,
      eventProperties: this.setEventProperties()
    };
  }
}
