import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, tap, take } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ICategory } from '@campus-cloud/libs/locations/common/categories/model';

interface IState {
  search_str: string;
  sort_field: string;
  sort_direction: string;
}

const state: IState = {
  search_str: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  state: IState = state;
  showEditModal = false;
  showCreateModal = false;
  showDeleteModal = false;
  loading$: Observable<boolean>;
  deletedCategory: ICategory = null;
  selectedCategory: ICategory = null;
  categories$: Observable<ICategory[]>;

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
    public store: Store<fromStore.ICategoriesState | fromRoot.IHeader | fromRoot.ISnackbar>
  ) {}

  onSearch(search_str) {
    this.state = {
      ...this.state,
      search_str
    };

    this.fetchFilteredCategories();
  }

  doSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetchFilteredCategories();
  }

  onLaunchCreateModal() {
    const eventName = amplitudeEvents.CLICKED_CREATE_ITEM;
    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_type: amplitudeEvents.LOCATION_CATEGORY
    };

    delete eventProperties['page_name'];

    this.showCreateModal = true;
    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

    setTimeout(() => $('#categoriesCreate').modal({ keyboard: true, focus: true }));
  }

  onLaunchEditModal(category: ICategory) {
    const eventName = amplitudeEvents.VIEWED_ITEM;

    const eventProperties = {
      ...this.cpTracking.getAmplitudeMenuProperties(),
      page_name: amplitudeEvents.INFO,
      page_type: amplitudeEvents.LOCATION_CATEGORY
    };

    this.showEditModal = true;
    this.selectedCategory = category;
    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

    setTimeout(() => $('#categoriesEdit').modal({ keyboard: true, focus: true }));
  }

  onLaunchDeleteModal(category: ICategory) {
    this.showDeleteModal = true;
    this.deletedCategory = category;

    setTimeout(() => $('#categoryDelete').modal({ keyboard: true, focus: true }));
  }

  onCreateTeardown() {
    this.showCreateModal = false;
    $('#categoriesCreate').modal('hide');
  }

  onEditTeardown() {
    this.selectedCategory = null;
    this.showEditModal = false;
    $('#categoriesEdit').modal('hide');
  }

  onDeleteTeardown() {
    this.deletedCategory = null;
    this.showDeleteModal = false;
    $('#categoryDelete').modal('hide');
  }

  fetch() {
    this.store.dispatch(new fromStore.GetCategories());

    this.categories$ = this.store.select(fromStore.getCategories);
  }

  fetchFilteredCategories() {
    this.store.dispatch(new fromStore.GetFilteredCategories({ state: this.state }));

    this.categories$ = this.store.select(fromStore.getFilteredCategories);
  }

  updateHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: {
        heading: 't_locations_manage_categories',
        subheading: null,
        em: null,
        crumbs: {
          url: 'locations',
          label: 'locations'
        },
        children: []
      }
    });
  }

  loadCategories() {
    this.store
      .select(fromStore.getCategoriesLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }),
        take(1)
      )
      .subscribe();

    this.categories$ = this.store.select(fromStore.getCategories);
  }

  ngOnInit() {
    this.updateHeader();
    this.loadCategories();

    this.loading$ = this.store
      .select(fromStore.getCategoriesLoading)
      .pipe(takeUntil(this.destroy$));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
