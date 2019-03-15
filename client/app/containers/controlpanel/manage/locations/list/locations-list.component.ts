import { filter, takeUntil, map, tap, take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { ManageHeaderService } from '../../utils';
import { amplitudeEvents } from '@shared/constants';
import { ILocation } from '@libs/locations/common/model';
import { BaseComponent } from '@app/base/base.component';
import * as fromCategoryStore from '../categories/store';
import { LocationType } from '@libs/locations/common/utils';
import { ICategory } from '@libs/locations/common/categories/model';
import { CPI18nService, CPTrackingService } from '@shared/services';
import { LocationsUtilsService } from '@libs/locations/common/utils';
import { LocationCategoryLocale } from '@libs/locations/common/categories/categories.status';
import { CategoriesUtilsService } from '@libs/locations/common/categories/categories.utils.service';

interface IState {
  search_str: string;
  sort_field: string;
  category_id: string;
  sort_direction: string;
}

const state: IState = {
  search_str: null,
  category_id: null,
  sort_field: 'name',
  sort_direction: 'asc'
};

@Component({
  selector: 'cp-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent extends BaseComponent implements OnInit, OnDestroy {
  state: IState = state;
  showDeleteModal = false;
  deleteLocation: ILocation;
  loading$: Observable<boolean>;
  categories$: Observable<IItem[]>;
  locations$: Observable<ILocation[]>;

  private destroy$ = new Subject();

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
    public headerService: ManageHeaderService,
    public categoryUtils: CategoriesUtilsService,
    public store: Store<fromStore.ILocationsState>
  ) {
    super();
  }

  get defaultParams(): HttpParams {
    return new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('category_id', this.state.category_id)
      .append('location_type', LocationType.location)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id);
  }

  fetch() {
    const payload = {
      startRange: this.startRange,
      endRange: this.endRange,
      params: this.defaultParams
    };

    this.store.dispatch(new fromStore.GetLocations(payload));

    this.locations$ = this.getLocations();
  }

  fetchFilteredLocations() {
    const payload = {
      startRange: this.startRange,
      endRange: this.endRange,
      params: this.defaultParams
    };

    this.store.dispatch(new fromStore.GetFilteredLocations(payload));

    this.locations$ = this.getLocations(true);
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
    this.state = {
      ...this.state,
      search_str
    };

    this.resetPagination();

    this.fetchFilteredLocations();
  }

  onCategorySelect(category_id) {
    this.state = {
      ...this.state,
      category_id
    };

    this.resetPagination();

    this.fetchFilteredLocations();
  }

  onDoSort(sort_field) {
    this.state = {
      ...this.state,
      sort_field: sort_field,
      sort_direction: this.state.sort_direction === 'asc' ? 'desc' : 'asc'
    };

    this.fetchFilteredLocations();
  }

  onLaunchDeleteModal(location: ILocation) {
    this.showDeleteModal = true;
    this.deleteLocation = location;

    setTimeout(() => $('#locationsDelete').modal());
  }

  loadCategories() {
    const categoryLabel = this.cpI18n.translate('all');
    this.categories$ = this.store.select(fromCategoryStore.getCategories).pipe(
      takeUntil(this.destroy$),
      tap((categories: ICategory[]) => {
        if (!categories.length) {
          const locale = CPI18nService.getLocale().startsWith('fr')
            ? LocationCategoryLocale.fr
            : LocationCategoryLocale.eng;

          const params = new HttpParams()
            .set('locale', locale)
            .set('location_type', LocationType.location)
            .set('school_id', this.session.g.get('school').id);

          this.store.dispatch(new fromCategoryStore.GetCategories({ params }));
        }
      }),
      map((res) => LocationsUtilsService.setCategoriesDropDown(res, categoryLabel))
    );
  }

  loadLocations() {
    this.store
      .select(fromStore.getLocationsLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }),
        take(1)
      )
      .subscribe();

    this.locations$ = this.getLocations();
  }

  listenForErrors() {
    this.store
      .select(fromStore.getLocationsError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          const payload = {
            body: this.cpI18n.translate('something_went_wrong'),
            sticky: true,
            autoClose: true,
            class: 'danger'
          };

          this.store.dispatch({
            type: fromRoot.baseActions.SNACKBAR_SHOW,
            payload
          });
        })
      )
      .subscribe();
  }

  getLocations(isFiltered?: boolean) {
    const selectLocations = isFiltered ? fromStore.getFilteredLocations : fromStore.getLocations;

    return this.store.select(selectLocations).pipe(
      map((locations: ILocation[]) => {
        const responseCopy = [...locations];

        return super.updatePagination(responseCopy);
      })
    );
  }

  onCreateClick() {
    this.router.navigate(['/manage/locations/create']);
  }

  onCategoriesClick() {
    const eventName = amplitudeEvents.CLICKED_PAGE_ITEM;
    const eventProperties = this.categoryUtils.getCategoriesAmplitudeProperties(true);

    this.cpTracking.amplitudeEmitEvent(eventName, eventProperties);

    this.router.navigate(['/manage/locations/categories']);
  }

  ngOnInit() {
    this.headerService.updateHeader();
    this.loadLocations();
    this.loadCategories();
    this.listenForErrors();

    this.loading$ = this.store.select(fromStore.getLocationsLoading);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
