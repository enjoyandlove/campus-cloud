import { Component, OnInit, ViewChild } from '@angular/core';
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
import { ContactTraceHeaderService } from '../utils';
import { IDateRange } from '@projects/campus-cloud/src/app/shared/components';
import { CasesUtilsService } from './cases.utils.service';
import { CasesService } from './cases.service';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { baseActionClass } from '@campus-cloud/store';
import { CasesListActionBoxComponent } from './list/components/list-action-box';
import { HttpParams } from '@angular/common/http';
import { Promise } from 'core-js';

interface IState {
  search_str: string;
  current_status_ids: string;
  exclude_external: boolean;
  start: any;
  end: any;
}

const state: IState = {
  search_str: null,
  current_status_ids: null,
  start: null,
  end: null,
  exclude_external: false
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
  isCaseCreate = false;
  isDownloading: boolean = false;
  private destroy$ = new Subject();
  resetFilterStatus: boolean = false;

  public startRange = 1;
  public maxPerPage = 20;
  public endRange = this.maxPerPage + 1;

  @ViewChild('actionbox') actionBox: CasesListActionBoxComponent;

  constructor(
    public cpI18nPipe: CPI18nPipe,
    public cpTracking: CPTrackingService,
    public headerService: ContactTraceHeaderService,
    public store: Store<fromStore.State>,
    private actionsSubject$: ActionsSubject,
    private util: CasesUtilsService,
    private service: CasesService,
    private session: CPSession
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
    if (!this.state.current_status_ids) {
      this.store.dispatch(new fromStore.GetCaseStatus(payload));
    } else {
      this.store.dispatch(new fromStore.UpdateCaseStatusCountForView(payload));
    }

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

  onSelectedFilter(statusID) {
    this.resetFilterStatus = false;
    this.state = {
      ...this.state,
      current_status_ids: statusID === 0 ? null : statusID
    };

    this.resetPagination();
    this.fetchFilteredCases();
  }

  onDateFilter(dateRange: IDateRange) {
    this.state = {
      ...this.state,
      start: dateRange.start,
      end: dateRange.end
    };

    this.resetPagination();
    this.fetchFilteredCases();
  }

  onDownload() {
    this.isDownloading = true;
    const caseSearch = this.util.defaultParams(this.state).append('all', '1');

    const caseStream$ = this.service.getCases(this.startRange, this.endRange, caseSearch);
    const casePromise = caseStream$.toPromise();

    let cases = [];
    let caseActivities = [];

    casePromise.then((res: any) => {
      if (!!res.length) {
        cases = [...res];
      }
    });

    let activitySearch = new HttpParams()
      .append('school_id', this.session.g.get('school').id)
      .append('start', this.state.start)
      .append('end', this.state.end)
      .append('new_status_ids', this.state.current_status_ids)
      .append('all', '1');

    const activityStream$ = this.service.getCaseActivityLog(
      this.startRange,
      this.endRange,
      activitySearch
    );
    const activityPromise = activityStream$.toPromise();
    activityPromise.then((res: any) => {
      if (!!res.length) {
        caseActivities = [...res];
      }
    });

    const ref = this;
    Promise.all([casePromise, activityPromise]).then(function() {
      if (!!caseActivities.length) {
        caseActivities = caseActivities
          .map((ca) => {
            const c = cases.find((c) => c.id === ca.case_id);
            if (!c) {
              return null;
            }
            const { firstname, lastname, extern_user_id, student_id } = c;
            return {
              ...ca,
              firstname,
              lastname,
              extern_user_id,
              student_id
            };
          })
          .filter((ca) => !!ca);
      }

      ref.util.exportCases(cases, ref.util.serializeCaseLog(caseActivities));
      ref.isDownloading = false;
    });
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
        return [...statuses];
      })
    );
  }

  launchCreateModal() {
    $('#createCase').modal({ keyboard: true, focus: true });
  }

  onLaunchCaseCreate(fromCreateMomdal) {
    if (fromCreateMomdal) {
      this.cases$ = this.getCases();
      this.resetFilterStatus = true;
    }

    this.isCaseCreate = true;

    setTimeout(() => {
      $('#createCase').modal({ keyboard: true, focus: true });
    }, 1);
  }

  onLaunchDeleteModal(_case: ICase) {
    this.showDeleteModal = true;
    this.deleteCase = _case;

    setTimeout(() => $('#deleteCase').modal({ keyboard: true, focus: true }));
  }

  loadCases() {
    this.store
      .select(fromStore.getCasesLoaded)
      .pipe(
        tap((loaded: boolean) => {
          this.fetch();
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

  listenForUpdateCase() {
    this.actionsSubject$
      .pipe(
        takeUntil(this.destroy$),
        filter(
          (action) =>
            action.type === fromStore.caseActions.CREATE_CASE_SUCCESS ||
            action.type === fromStore.caseActions.DELETE_CASE_SUCCESS
        )
      )
      .subscribe(() => {
        $('#createCase').modal('hide');
        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18nPipe.transform('case_create_message_success')
          })
        );

        this.state = {
          search_str: null,
          start: null,
          end: null,
          exclude_external: false,
          current_status_ids: null
        };

        this.actionBox.onResetActionBox();
        this.store.dispatch(new fromStore.GetCaseStatus());
        this.getCasesStatus();
      });
  }

  listenForErrors() {
    this.store
      .select(fromStore.getCasesError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          let err_message;
          this.store
            .select(fromStore.getCasesErrorMessage)
            .pipe(
              tap((message) => {
                err_message = message;
              })
            )
            .subscribe();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.headerService.updateHeader();
    this.loadCases();
    this.loadCaseStatus();
    this.listenForUpdateCase();
    this.loading$ =
      this.store.select(fromStore.getCasesLoading) ||
      this.store.select(fromStore.getCaseStatusLoading);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  onContactTraceAction(caseItem: ICase) {
    const updatedCase = {
      ...caseItem,
      perform_current_action: true
    };
    this.store.dispatch(
      new fromStore.EditCase({
        body: updatedCase,
        id: caseItem.id
      })
    );
  }
}
