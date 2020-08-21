import { Component, OnInit } from '@angular/core';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, filter, tap, take } from 'rxjs/operators';

import { IFilterState } from '@controlpanel/manage/services/providers.utils.service';
import { BaseComponent } from '@projects/campus-cloud/src/app/base';
import { CPTrackingService } from '@projects/campus-cloud/src/app/shared/services';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';

import { ICase, ICaseStatus } from './cases.interface';

import * as fromStore from './store';
import * as fromRoot from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { Router } from '@angular/router';
import { ContactTraceHeaderService } from '../utils';
import { CasesService } from './cases.service';
import { CasesUtilsService } from './cases.utils.service';

interface IState {
  search_str: string;
  status_id: string;
}

const state: IState = {
  search_str: null,
  status_id: null
};

@Component({
  selector: 'cp-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent extends BaseComponent implements OnInit {
  filterState: IFilterState = {
    dateRange: null,
    searchText: null,
    studentFilter: null
  };

  state: IState = state;
  showDeleteModal = false;
  deleteCase: ICase;
  cases$: Observable<ICase[]>;
  caseStatus$: Observable<ICaseStatus[]>;
  loading$: Observable<boolean>;
  isCaseCreate: boolean = false;
  private destroy$ = new Subject();

  constructor(
    public router: Router,
    public session: CPSession,
    public cpI18nPipe: CPI18nPipe,
    public cpTracking: CPTrackingService,
    public headerService: ContactTraceHeaderService,
    public service: CasesService,
    public store: Store<fromStore.ICasesState>,
    public utils: CasesUtilsService,
    private actionsSubject$: ActionsSubject
  ) {
    super();
  }

  fetch() {
    const payload = {
      state: this.state,
      startRange: this.startRange,
      endRange: this.endRange
    };

    this.store.dispatch(new fromStore.GetCases(payload));

    this.cases$ = this.getCases();
  }

  fetchFilteredCases() {
    const payload = {
      state: this.state,
      startRange: this.startRange,
      endRange: this.endRange
    };
    this.store.dispatch(new fromStore.GetFilteredCases(payload));

    this.cases$ = this.getCases(true);
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

    this.fetchFilteredCases();
  }

  getCases(isFiltered?: boolean) {
    const selectedCases = isFiltered ? fromStore.getFilteredCases : fromStore.getCases;

    return this.store.select(selectedCases).pipe(
      map((cases: ICase[]) => {
        const responseCopy = [...cases];

        return super.updatePagination(responseCopy);
      })
    );
  }

  getCasesStatus() {
    return this.store.select(fromStore.getCaseStatus).pipe(
      map((statuses: ICaseStatus[]) => {
        const responseCopy = [...statuses];

        return responseCopy;
      })
    );
  }

  launchCreateModal() {
    $('#createCase').modal({ keyboard: true, focus: true });
  }

  onLaunchCaseCreate() {
    this.actionsSubject$
      .pipe(
        takeUntil(this.destroy$),
        filter((action) => action.type === fromStore.caseActions.CREATE_CASE_SUCCESS)
      )
      .subscribe(() => {
        this.store.dispatch(new fromStore.GetCaseStatus());
        this.getCasesStatus();
      });

    this.cases$ = this.getCases();

    this.isCaseCreate = true;
    setTimeout(() => {
      $('#createCase').modal({ keyboard: true, focus: true });
    }, 1);
  }

  onLaunchDeleteModal(_case: ICase) {
    this.showDeleteModal = true;
    this.deleteCase = _case;

    setTimeout(() => $('#casesDelete').modal({ keyboard: true, focus: true }));
  }

  loadCases() {
    this.store
      .select(fromStore.getCasesLoaded)
      .pipe(
        tap((loaded: boolean) => {
          if (!loaded) {
            this.fetch();
          }
        }),
        take(1)
      )
      .subscribe();

    this.cases$ = this.getCases();
  }

  loadCaseStatus() {
    this.store.dispatch(new fromStore.GetCaseStatus());
    this.caseStatus$ = this.getCasesStatus();
  }

  listenForErrors() {
    this.store
      .select(fromStore.getCasesError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          const payload = {
            body: this.cpI18nPipe.transform('something_went_wrong'),
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

  ngOnInit(): void {
    this.headerService.updateHeader();
    this.loadCases();
    this.loadCaseStatus();
    this.listenForErrors();
    this.loading$ = this.store.select(fromStore.getCaseStatusLoading);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
