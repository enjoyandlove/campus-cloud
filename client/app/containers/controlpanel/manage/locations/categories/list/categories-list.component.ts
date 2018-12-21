import { takeUntil, filter, tap, take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromStore from '../store';
import * as fromRoot from '@app/store';
import { CPSession } from '@app/session';
import { CPI18nService } from '@shared/services';
import { ICategory } from '../categories.interface';
import { isDefault, Locale } from '../categories.status';

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
  editCategory = '';
  deleteCategory = '';
  state: IState = state;
  showCreateModal = false;
  loading$: Observable<boolean>;
  categories$: Observable<ICategory[]>;

  private destroy$ = new Subject();

  constructor(
    public session: CPSession,
    public cpI18n: CPI18nService,
    public store: Store<fromStore.ICategoriesState | fromRoot.IHeader | fromRoot.ISnackbar>
  ) {}

  onSearch(search_str) {
    this.state = {
      ...this.state,
      search_str
    };

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

  onLaunchCreateModal() {
    this.showCreateModal = true;

    setTimeout(() => $('#categoriesCreate').modal());
  }

  isDefault(val) {
    return this.cpI18n.translate(isDefault[val]);
  }

  fetch() {
    const locale = CPI18nService.getLocale().startsWith('fr')
      ? Locale.fr : Locale.eng;

    const params = new HttpParams()
      .append('locale', locale)
      .append('search_str', this.state.search_str)
      .append('sort_field', this.state.sort_field)
      .append('sort_direction', this.state.sort_direction)
      .append('school_id', this.session.g.get('school').id);

    this.store.dispatch(new fromStore.GetCategories({ params }));
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

  listenForErrors() {
    this.store
      .select(fromStore.getCategoriesError)
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
    this.updateHeader();
    this.loadCategories();
    this.listenForErrors();

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

