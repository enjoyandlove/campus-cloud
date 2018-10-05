import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { IDeal } from '../deals.interface';
import { DealsService } from '../deals.service';
import { ManageHeaderService } from '../../utils';
import { CPSession } from '../../../../../session';
import { BaseComponent } from '../../../../../base';
import { FORMAT } from '../../../../../shared/pipes';
import { CP_TRACK_TO } from '../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../shared/constants/analytics';
import { HEADER_UPDATE, IHeader } from '../../../../../reducers/header.reducer';
import { CPI18nService, CPTrackingService } from '../../../../../shared/services';

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
  sort_field: 'expiration',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-deals-list',
  templateUrl: './deals-list.component.html',
  styleUrls: ['./deals-list.component.scss']
})
export class DealsListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  deleteDeal;
  sortingLabels;
  state: IState = state;
  launchDeleteModal = false;
  dateFormat = FORMAT.SHORT;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: DealsService,
    public cpTracking: CPTrackingService,
    public headerService: ManageHeaderService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onPaginationNext() {
    super.goToNext();

    this.fetch();
  }

  onPaginationPrevious() {
    super.goToPrevious();

    this.fetch();
  }

  onSearch(search_str) {
    this.state = Object.assign({}, this.state, { search_str });

    this.resetPagination();

    this.fetch();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetch();
  }

  onDeleted(id: number) {
    this.deleteDeal = null;
    this.state = Object.assign({}, this.state, {
      deals: this.state.deals.filter((deal) => deal.id !== id)
    });

    if (this.state.deals.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  doFilter(filter) {
    this.state = Object.assign({}, this.state, {
      store_id: filter.store_id
    });

    this.fetch();
  }

  public fetch() {
    const store_id = this.state.store_id ? this.state.store_id.toString() : null;

    const search = new HttpParams()
      .append('store_id', store_id)
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getDeals(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, deals: res.data }));
  }

  buildHeader() {
    this.store.dispatch({
      type: HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
  }

  ngOnInit() {
    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.fetch();
    this.buildHeader();

    this.sortingLabels = {
      name: this.cpI18n.translate('name'),
      store_name: this.cpI18n.translate('t_deals_list_grid_column_store'),
      start: this.cpI18n.translate('t_deals_form_posting_start_date'),
      expiration: this.cpI18n.translate('t_deals_form_posting_end_date')
    };
  }
}
