import { filter, takeUntil, map, tap, take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { ManageHeaderService } from '../../utils';
import { IItem } from '@campus-cloud/shared/components';
import * as fromCategoryStore from '../categories/store';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { BaseComponent } from '@campus-cloud/base/base.component';
import { ILocation } from '@campus-cloud/libs/locations/common/model';
import { CPI18nService, CPTrackingService } from '@campus-cloud/shared/services';
import { ICategory } from '@campus-cloud/libs/locations/common/categories/model';
import { LocationsUtilsService } from '@campus-cloud/libs/locations/common/utils';

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
    public store: Store<fromStore.ILocationsState>
  ) {
    super();
  }

  fetch() {
    const payload = {
      state: this.state,
      startRange: this.startRange,
      endRange: this.endRange
    };

    this.store.dispatch(new fromStore.GetLocations(payload));

    this.locations$ = this.getLocations();
  }

  fetchFilteredLocations() {
    const payload = {
      state: this.state,
      startRange: this.startRange,
      endRange: this.endRange
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

    setTimeout(() => $('#locationsDelete').modal({ keyboard: true, focus: true }));
  }

  loadCategories() {
    const categoryLabel = this.cpI18n.translate('all');
    this.categories$ = this.store.select(fromCategoryStore.getCategories).pipe(
      takeUntil(this.destroy$),
      tap((categories: ICategory[]) => {
        if (!categories.length) {
          this.store.dispatch(new fromCategoryStore.GetCategories());
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
    const eventProperties = {
      ...this.cpTracking.getEventProperties(),
      page_type: amplitudeEvents.LOCATION_CATEGORY
    };

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
