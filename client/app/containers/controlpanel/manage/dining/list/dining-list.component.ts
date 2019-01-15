import { filter, takeUntil, map, tap, take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { IItem } from '@shared/components';
import { CPI18nService } from '@shared/services';
import { ManageHeaderService } from '../../utils';
import { ILocation } from '../../locations/model';
import { BaseComponent } from '@app/base/base.component';

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
  selector: 'cp-dining-list',
  templateUrl: './dining-list.component.html',
  styleUrls: ['./dining-list.component.scss']
})
export class DiningListComponent extends BaseComponent implements OnInit, OnDestroy {
  eventData;
  sortingLabels;
  state: IState = state;
  loading$: Observable<boolean>;
  categories$: Observable<IItem[]>;
  locations$: Observable<ILocation[]>;

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public headerService: ManageHeaderService,
    public store: Store<fromStore.IDiningState | fromRoot.IHeader>
  ) {
    super();
  }

  fetch() {
    const search = new HttpParams()
      .append('location_type', 'dining')
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('category_id', this.state.category_id)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id);

    const payload = {
      startRange: this.startRange,
      endRange: this.endRange,
      params: search
    };

    this.store.dispatch(new fromStore.GetDining(payload));
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

    this.fetch();
  }

  onCategorySelect(category_id) {
    this.state = {
      ...this.state,
      category_id
    };

    this.resetPagination();

    this.fetch();
  }

  onDoSort(sort_field) {
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

  loadDining() {
    this.store
      .select(fromStore.getDiningLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }),
        take(1)
      )
      .subscribe();

    this.locations$ = this.store.select(fromStore.getDining).pipe(
      map((dining: ILocation[]) => {
        const responseCopy = [...dining];

        return super.updatePagination(responseCopy);
      })
    );
  }

  listenForErrors() {
    this.store
      .select(fromStore.getDiningError)
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
    this.loadDining();
    this.buildHeader();
    this.listenForErrors();

    this.loading$ = this.store.select(fromStore.getDiningLoading);
    this.categories$ = of([{label: '---', action: null}]);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
