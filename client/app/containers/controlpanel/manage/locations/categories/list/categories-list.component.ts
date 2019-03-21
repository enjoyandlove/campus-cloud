import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, tap, take } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { amplitudeEvents } from '@shared/constants';
import { LocationType } from '@libs/locations/common/utils';
import { CPI18nService, CPTrackingService } from '@shared/services';
import { ICategory, LocationCategoryLocale } from '@libs/locations/common/categories/model';

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
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.LOCATION_CATEGORY
    };

    this.showCreateModal = true;
    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

    setTimeout(() => $('#categoriesCreate').modal());
  }

  onLaunchEditModal(category: ICategory) {
    const eventName = amplitudeEvents.VIEWED_ITEM;

    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_name: amplitudeEvents.INFO,
      page_type: amplitudeEvents.LOCATION_CATEGORY
    };

    this.showEditModal = true;
    this.selectedCategory = category;
    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

    setTimeout(() => $('#categoriesEdit').modal());
  }

  onLaunchDeleteModal(category: ICategory) {
    this.showDeleteModal = true;
    this.deletedCategory = category;

    setTimeout(() => $('#categoryDelete').modal());
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

  get defaultParams(): HttpParams {
    const locale = CPI18nService.getLocale().startsWith('fr')
      ? LocationCategoryLocale.fr
      : LocationCategoryLocale.eng;

    return new HttpParams()
      .set('locale', locale)
      .set('location_type', LocationType.location)
      .set('school_id', this.session.g.get('school').id)
      .set('search_str', this.state.search_str)
      .set('sort_field', this.state.sort_field)
      .set('sort_direction', this.state.sort_direction);
  }

  fetch() {
    this.store.dispatch(new fromStore.GetCategories({ params: this.defaultParams }));

    this.categories$ = this.store.select(fromStore.getCategories);
  }

  fetchFilteredCategories() {
    this.store.dispatch(new fromStore.GetFilteredCategories({ params: this.defaultParams }));

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

  loadCategoryTypes() {
    this.store
      .select(fromStore.getCategoriesType)
      .pipe(
        takeUntil(this.destroy$),
        tap((types: IItem[]) => {
          if (!types.length) {
            const params = this.defaultParams;

            this.store.dispatch(new fromStore.GetCategoriesType({ params }));
          }
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.updateHeader();
    this.loadCategories();
    this.loadCategoryTypes();

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
