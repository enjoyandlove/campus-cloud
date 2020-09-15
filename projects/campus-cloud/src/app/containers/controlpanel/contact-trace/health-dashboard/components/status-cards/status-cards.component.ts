import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import * as fromStore from '../../store';
import { Router } from '@angular/router';
import { ICaseStatus } from '../../../cases/cases.interface';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolReadResource, canSchoolWriteResource } from '@campus-cloud/shared/utils';
import { CPSession } from '@projects/campus-cloud/src/app/session';

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

  destroy$ = new Subject();

  constructor(
    public store: Store<{ healthDashboard: fromStore.DashboardState }>,
    private router: Router,
    private session: CPSession
  ) {
    this.getCaseStatusesByRank();
  }

  getCaseStatusesByRank() {
    this.store.dispatch(fromStore.getCaseStatus());
    this.caseStatusesByRank$ = this.store
      .select(fromStore.selectCaseStatusesByRank)
      .pipe(startWith({}));
    this.caseStatusesByRank$
      .pipe(takeUntil(this.destroy$))
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
        state: { toCaseStatus: this.caseStatusesByRank[this.statusMapping.exposed] }
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
  }
}
