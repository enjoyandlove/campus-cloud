import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy } from '@angular/core';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { Store, select } from '@ngrx/store';
import { IDateRange } from '@projects/campus-cloud/src/app/shared/components';
import { Observable, Subject } from 'rxjs';
import { DashboardUtilsService } from '../../../../dashboard/dashboard.utils.service';
import * as fromStore from '../../store';

@Component({
  selector: 'cp-health-dashboard-action-box',
  templateUrl: './health-dashboard-action-box.component.html',
  styleUrls: ['./health-dashboard-action-box.component.scss']
})
export class HealthDashboardActionBoxComponent implements OnDestroy {
  audiences$: Observable<any[]>;
  dateRanges: IDateRange[];
  selectedAudience$: Observable<any>;
  selectedDateRanges$: Observable<IDateRange>;
  destroy$ = new Subject();

  constructor(
    private engageUtils: EngageUtils.EngagementUtilsService,
    private dashboardUtils: DashboardUtilsService,
    private store: Store<{ healthDashboard: fromStore.HealthDashboardState }>
  ) {
    this.audiences$ = this.engageUtils.getAudienceFilter();
    this.dateRanges = [
      this.dashboardUtils.last30Days(),
      this.dashboardUtils.last90Days(),
      this.dashboardUtils.lastYear()
    ];

    this.selectedAudience$ = this.store.pipe(
      select(fromStore.selectAudienceFilter),
      takeUntil(this.destroy$)
    );
    this.selectedDateRanges$ = this.store.pipe(
      select(fromStore.selectDateFilter),
      takeUntil(this.destroy$)
    );

    this.store.dispatch(fromStore.setDateFilter(this.dashboardUtils.last30Days()));
    this.store.dispatch(fromStore.setAudienceFilter(null));
  }

  onDateChange(dates: IDateRange) {
    this.store.dispatch(fromStore.setDateFilter(dates));
  }

  onAudienceChange(audience) {
    this.store.dispatch(fromStore.setAudienceFilter({ audience }));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
