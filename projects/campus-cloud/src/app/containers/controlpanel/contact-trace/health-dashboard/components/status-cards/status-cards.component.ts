import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolReadResource, canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { select, Store } from '@ngrx/store';
import { CPSession } from '@projects/campus-cloud/src/app/session';
import { Observable, Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { ICaseStatus } from '../../../cases/cases.interface';
import * as fromStore from '../../store';

@Component({
  selector: 'cp-status-cards',
  templateUrl: './status-cards.component.html',
  styleUrls: ['./status-cards.component.scss']
})
export class StatusCardsComponent implements OnDestroy {
  statusMapping = {
    confirmed: 1,
    selfReported: 2,
    symptomatic: 3,
    exposed: 4,
    clear: 5
  };
  caseStatusesByRank$: Observable<Record<number, ICaseStatus>>;
  caseStatusesByRank: Record<number, ICaseStatus>;
  loading$: Observable<boolean>;
  audience: {
    label: string;
    listId: string;
  } = null;
  destroy$ = new Subject();

  constructor(
    public store: Store<{ healthDashboard: fromStore.HealthDashboardState }>,
    private router: Router,
    private session: CPSession
  ) {
    this.loading$ = this.store.pipe(
      select(fromStore.selectCaseStatusesLoading),
      takeUntil(this.destroy$)
    );

    this.store
      .pipe(
        select(fromStore.selectAudienceFilter),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => (this.audience = value));

    this.store
      .pipe(
        select(fromStore.selectCaseStatusesByRank),
        startWith({}),
        takeUntil(this.destroy$)
      )
      .subscribe((value) => (this.caseStatusesByRank = value));
  }

  onReviewReports() {
    if (this.caseStatusesByRank[this.statusMapping.selfReported]) {
      this.router.navigateByUrl('/contact-trace/cases', {
        state: { statusId: this.caseStatusesByRank[this.statusMapping.selfReported].id }
      });
    }
  }

  sendMessageToNewExposures() {
    if (this.caseStatusesByRank[this.statusMapping.exposed]) {
      this.router.navigateByUrl('/contact-trace/exposure-notification/edit/0', {
        state: {
          toCaseStatus: this.caseStatusesByRank[this.statusMapping.exposed],
          audience: this.audience
        }
      });
    }
  }

  canReadCases() {
    return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.contact_trace_cases);
  }

  canSendMessage() {
    return canSchoolWriteResource(
      this.session.g,
      CP_PRIVILEGES_MAP.contact_trace_exposure_notification
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
