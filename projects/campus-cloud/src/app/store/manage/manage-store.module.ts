/* tslint:disable:max-line-length */
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';

import * as fromJobs from './jobs';
import * as fromDeals from './deals';
import * as fromLinks from './links';
import * as jobsReducer from './jobs/jobs.reducer';
import * as dealsReducer from './deals/deals.reducer';
import * as linksReducer from './links/links.reducer';
import { JobsService } from '../../containers/controlpanel/manage/jobs/jobs.service';
import { DealsService } from '../../containers/controlpanel/manage/deals/deals.service';
import { LinksService } from '../../containers/controlpanel/manage/links/links.service';
import { DealsStoreService } from '../../containers/controlpanel/manage/deals/stores/store.service';
import { EmployerService } from '../../containers/controlpanel/manage/jobs/employers/employer.service';

export interface IManageState {
  jobs: fromJobs.IJobsState;
  deals: fromDeals.IDealsState;
  links: fromLinks.ILinksState;
}

const reducers: ActionReducerMap<IManageState> = {
  jobs: jobsReducer.reducer,
  deals: dealsReducer.reducer,
  links: linksReducer.reducer
};

const effects: any[] = [fromJobs.JobsEffects, fromDeals.DealsEffects, fromLinks.LinksEffects];

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('manage', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [JobsService, EmployerService, DealsService, DealsStoreService, LinksService]
})
export class ManageStoreModule {}
