import { Component } from '@angular/core';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { Store } from '@ngrx/store';
import { IDateRange } from '@projects/campus-cloud/src/app/shared/components';
import { Observable } from 'rxjs';
import * as fromStore from '../../store';

@Component({
  selector: 'cp-health-dashboard-action-box',
  templateUrl: './health-dashboard-action-box.component.html',
  styleUrls: ['./health-dashboard-action-box.component.scss']
})
export class HealthDashboardActionBoxComponent {
  audiences$: Observable<any[]>;
  dateRanges: EngageUtils.IDateFilter[];
  selectedAudience$: Observable<any>;

  constructor(
    private engageUtils: EngageUtils.EngagementUtilsService,
    public store: Store<{ healthDashboard: fromStore.HealthDashboardState }>
  ) {
    this.audiences$ = this.engageUtils.getAudienceFilter();
    this.dateRanges = this.engageUtils.dateFilter();
    this.selectedAudience$ = this.store.select(fromStore.selectAudienceFilter);
  }

  onDateChange(dates: IDateRange) {
    const { start, end } = dates;
    this.store.dispatch(fromStore.setDateFilter({ start, end }));
  }

  onAudienceChange(audience) {
    this.store.dispatch(fromStore.setAudienceFilter({ audience }));
  }
}
