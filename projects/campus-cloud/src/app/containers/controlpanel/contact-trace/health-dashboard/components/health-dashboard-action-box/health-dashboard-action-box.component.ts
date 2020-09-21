import { Component } from '@angular/core';
import * as EngageUtils from '@controlpanel/assess/engagement/engagement.utils.service';
import { Store } from '@ngrx/store';

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

  onDateChange(dates) {
    if (dates.payload) {
      dates = {
        label: dates.label,
        start: dates.payload.range.start,
        end: dates.payload.range.end
      };
    }
    this.store.dispatch(fromStore.setDateFilter({ dates.start, dates.end }));
  }

  onAudienceChange(audience) {
    this.store.dispatch(fromStore.setAudienceFilter({ audience }));
  }
}
