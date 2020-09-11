import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@projects/campus-cloud/src/app/base';
import { Observable, Subject } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { ICaseStatus } from '../cases/cases.interface';
import * as fromStore from './store';

@Component({
  selector: 'cp-health-dashboard',
  templateUrl: './health-dashboard.component.html',
  styleUrls: ['./health-dashboard.component.scss']
})
export class HealthDashboardComponent extends BaseComponent implements OnInit, OnDestroy {
  statusMapping = {
    confirmed: 1,
    selfReported: 2,
    symptomatic: 3,
    exposed: 4,
    clear: 5
  };
  caseStatusesByRank$: Observable<Record<number, ICaseStatus>>;

  destroy$ = new Subject();

  constructor(public store: Store<{ healthDashboard: fromStore.DashboardState }>) {
    super();
  }

  ngOnInit() {
    this.getCaseStatusesByRank();
    this.store.dispatch(fromStore.getCaseStatus());
  }

  getCaseStatusesByRank() {
    this.caseStatusesByRank$ = this.store.select(fromStore.selectCaseStatusesByRank).pipe(
      startWith({})
    );
    this.caseStatusesByRank$.pipe(takeUntil(this.destroy$)).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
