import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, ActionsSubject } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { map, filter, takeUntil, tap } from 'rxjs/operators';

import * as fromStore from '../store';
import * as fromRoot from '@campus-cloud/store';
import { Destroyable, Mixin } from '@campus-cloud/shared/mixins';

import { BaseComponent } from '@campus-cloud/base/base.component';
import { ICase } from '../cases.interface';
import { CasesService } from '../cases.service';
import { HttpParams } from '@angular/common/http';
import { CPSession } from '@campus-cloud/session';
import { CaseLogComponent } from './components';
import { baseActionClass } from '@campus-cloud/store';
import { CPI18nPipe } from '@projects/campus-cloud/src/app/shared/pipes';

@Mixin([Destroyable])
@Component({
  selector: 'cp-case-details',
  templateUrl: './case-details.component.html',
  styleUrls: ['./case-details.component.scss']
})
export class CaseDetailsComponent extends BaseComponent implements OnInit {
  @ViewChild('caseLogList') caseLogList: CaseLogComponent;
  isPendingActionFinished: boolean = true;
  isSubmitted: boolean = true;
  isEditing: boolean = false;
  caseId;
  userId;
  case_status;
  case: ICase;
  loading: boolean;
  pageLoading: boolean;
  getCasesById$: Observable<any>;
  caseNotFound = false;

  destroy$ = new Subject();

  constructor(
    private route: ActivatedRoute,
    public store: Store<fromStore.State | fromRoot.IHeader>,
    public service: CasesService,
    private session: CPSession,
    private router: Router,
    public actionsSubject$: ActionsSubject,
    private cpI18n: CPI18nPipe
  ) {
    super();
    this.caseId = this.route.snapshot.params['caseId']
      ? this.route.snapshot.params['caseId']
      : null;
    this.userId = this.route.snapshot.params['userId']
      ? this.route.snapshot.params['userId']
      : null;
  }

  buildHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: fromRoot.baseActions.HEADER_UPDATE,
        payload: {
          heading: 'case_details',
          crumbs: {
            url: 'cases',
            label: 'cases'
          },
          subheading: null,
          em: null,
          children: []
        }
      });
    });
  }

  loadCaseDetails() {
    if (this.caseId) {
      this.pageLoading = true;
      this.loading = true;
      this.getCasesById$ = this.store.select(fromStore.getCasesById).pipe(
        takeUntil(this.destroy$),
        filter((res: ICase) => !!res)
      );

      this.getCasesById$.subscribe((res: ICase) => {
        if (res) {
          this.case = res;
          this.loading = false;
          this.isEditing = false;
        }
        this.pageLoading = false;
      });
    } else {
      /*TODO : Check if we can remove this, same action for navigation to /caseInfo/:userId*/
      this.loading = true;
      const params = new HttpParams()
        .append('user_id', this.userId.toString())
        .append('school_id', this.session.g.get('school').id);

      const stream$ = this.service.getCaseById(params);

      stream$
        .toPromise()
        .then((res: any) => {
          this.case = res[0];
          this.loading = false;
          this.pageLoading = false;
          this.isEditing = false;
        })
        .catch((reason) => {
          this.loading = false;
          this.pageLoading = false;
          this.caseNotFound = true;
        });
    }
  }

  onActionFinished(flag: boolean) {
    this.isPendingActionFinished = flag;
  }

  onEditing(editing) {
    this.isEditing = editing;
  }

  listenForUpdateCase() {
    this.actionsSubject$
      .pipe(
        takeUntil(this.destroy$),
        filter((action) => action.type === fromStore.caseActions.EDIT_CASE_SUCCESS)
      )
      .subscribe(() => {
        this.store.dispatch(
          new baseActionClass.SnackbarSuccess({
            body: this.cpI18n.transform('case_update_message_success')
          })
        );
        this.loadCaseDetails();
      });
  }

  listenForErrors() {
    this.store
      .select(fromStore.getCasesError)
      .pipe(
        takeUntil(this.destroy$),
        filter((error) => error),
        tap(() => {
          this.store.dispatch(
            new baseActionClass.SnackbarError({
              body: this.cpI18n.transform('case_create_message_exist')
            })
          );
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.listenForErrors();
    this.listenForUpdateCase();
    this.router.routeReuseStrategy.shouldReuseRoute = () => {
      return false;
    };

    if (this.caseId) {
      this.store.dispatch(new fromStore.SetSelectedCaseId({ id: this.caseId }));
      this.store.dispatch(new fromStore.GetCaseById({ id: this.caseId }));
    }

    this.loadCaseDetails();
    this.buildHeader();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
