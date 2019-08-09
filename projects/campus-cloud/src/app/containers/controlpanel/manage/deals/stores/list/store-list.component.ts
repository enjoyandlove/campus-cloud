import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { IStore } from '../store.interface';
import { DealsStoreService } from '../store.service';
import { CPSession } from '../../../../../../session';
import { BaseComponent } from '../../../../../../base';
import { baseActions, IHeader } from '../../../../../../store/base';
import { CP_TRACK_TO } from '../../../../../../shared/directives/tracking';
import { amplitudeEvents } from '../../../../../../shared/constants/analytics';
import { CPI18nService, CPTrackingService } from '../../../../../../shared/services';

export interface IState {
  stores: Array<IStore>;
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state = {
  stores: [],
  search_str: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss']
})
export class StoreListComponent extends BaseComponent implements OnInit {
  loading;
  eventData;
  deleteStore;
  selectedStore;
  sortingLabels;
  state: IState = state;
  launchEditModal = false;
  launchDeleteModal = false;
  launchCreateModal = false;

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<IHeader>,
    public service: DealsStoreService,
    public cpTracking: CPTrackingService
  ) {
    super();
    super.isLoading().subscribe((loading) => (this.loading = loading));
  }

  onLaunchCreateModal() {
    this.launchCreateModal = true;

    setTimeout(
      () => {
        $('#createModal').modal({ keyboard: true, focus: true });
      },

      1
    );
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

  onCreated(newStore: IStore): void {
    this.launchCreateModal = false;
    this.state.stores = [newStore, ...this.state.stores];
  }

  onEdited(editStore: IStore) {
    this.launchEditModal = false;
    this.selectedStore = null;

    this.state = Object.assign({}, this.state, {
      stores: this.state.stores.map((store) => (store.id === editStore.id ? editStore : store))
    });
  }

  onDeleted(id: number) {
    this.deleteStore = null;
    this.state = Object.assign({}, this.state, {
      stores: this.state.stores.filter((store) => store.id !== id)
    });

    if (this.state.stores.length === 0 && this.pageNumber > 1) {
      this.resetPagination();
      this.fetch();
    }
  }

  public fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id.toString());

    super
      .fetchData(this.service.getStores(this.startRange, this.endRange, search))
      .then((res) => (this.state = { ...this.state, stores: res.data }));
  }

  buildHeader() {
    this.store.dispatch({
      type: baseActions.HEADER_UPDATE,
      payload: {
        heading: `stores_manage_store`,
        subheading: null,
        em: null,
        crumbs: {
          label: 'deals',
          url: 'deals'
        },
        children: []
      }
    });
  }

  ngOnInit() {
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.STORE
    };

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties
    };

    this.fetch();
    this.buildHeader();

    this.sortingLabels = {
      name: this.cpI18n.translate('name')
    };
  }
}
