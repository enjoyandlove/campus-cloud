import { filter, takeUntil, map, tap, take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { LocationModel } from '../model';
import { ManageHeaderService } from '../../utils';
import { BaseComponent } from '@app/base/base.component';
import { CP_TRACK_TO } from '@shared/directives/tracking';
import { amplitudeEvents } from '@shared/constants/analytics';
import { environment } from '@client/environments/environment';
import { CPI18nService, CPTrackingService } from '@shared/services';

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
  selector: 'cp-locations-list',
  templateUrl: './locations-list.component.html',
  styleUrls: ['./locations-list.component.scss']
})
export class LocationsListComponent extends BaseComponent implements OnInit, OnDestroy {
  eventData;
  sortingLabels;
  deleteLocation = '';
  state: IState = state;
  loading$: Observable<boolean>;
  locations$: Observable<LocationModel[]>;
  defaultImage = `${environment.root}public/default/user.png`;

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public cpTracking: CPTrackingService,
    public headerService: ManageHeaderService,
    public store: Store<fromStore.ILocationsState | fromRoot.IHeader>
  ) {
    super();
  }

  private fetch() {
    const search = new HttpParams()
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id);

    const payload = {
      startRange: this.startRange,
      endRange: this.endRange,
      params: search
    };

    this.store.dispatch(new fromStore.GetLocations(payload));
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

  buildHeader() {
    this.store.dispatch({
      type: fromRoot.baseActions.HEADER_UPDATE,
      payload: this.headerService.filterByPrivileges()
    });
  }

  loadLocations() {
    this.store
      .select(fromStore.getLocationLoadedAll)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }),
        take(1)
      )
      .subscribe();

    this.locations$ = this.store.select(fromStore.getLocations).pipe(
      map((locations: LocationModel[]) => {
        const responseCopy = [...locations];

        return super.updatePagination(responseCopy);
      })
    );
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

  ngOnInit() {
    this.buildHeader();
    this.loadLocations();
    this.listenForErrors();

    this.eventData = {
      type: CP_TRACK_TO.AMPLITUDE,
      eventName: amplitudeEvents.VIEWED_ITEM,
      eventProperties: this.cpTracking.getEventProperties()
    };

    this.sortingLabels = {
      locations: this.cpI18n.translate('name')
    };

    this.loading$ = this.store.select(fromStore.getLocationsLoading);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
