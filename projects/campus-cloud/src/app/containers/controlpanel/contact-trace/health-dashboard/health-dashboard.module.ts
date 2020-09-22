import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { ChartsUtilsService } from '@campus-cloud/shared/services';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { EngagementService } from '../../assess/engagement/engagement.service';
import { EngagementUtilsService } from '../../assess/engagement/engagement.utils.service';
import { DashboardUtilsService } from '../../dashboard/dashboard.utils.service';
import { CasesService } from '../cases/cases.service';
import { FormsService } from '../forms';
import {
  HealthDashboardActionBoxComponent,
  HealthDashboardCaseStatusGraphComponent,
  StatusCardsComponent
} from './components';
import { HealthDashboardFormCompletionComponent } from './components/form-completion';
import {
  HealthDashboardFormCompletionGraphComponent,
  HealthDashboardFormCompletionSourceComponent
} from './components/form-completion/components';
import { HealthDashboardComponent } from './health-dashboard.component';
import { HealthPassRoutingModule } from './health-dashboard.routing.module';
import { HealthDashboardService } from './health-dashboard.service';
import { HealthDashboardUtilsService } from './health-dashboard.utils.service';
import { DashboardEffects } from './store/effects';
import { reducers } from './store/reducers';

@NgModule({
  declarations: [
    HealthDashboardComponent,
    HealthDashboardActionBoxComponent,
    StatusCardsComponent,
    HealthDashboardFormCompletionComponent,
    HealthDashboardFormCompletionGraphComponent,
    HealthDashboardCaseStatusGraphComponent,
    HealthDashboardFormCompletionSourceComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HealthPassRoutingModule,
    EffectsModule.forFeature([DashboardEffects]),
    StoreModule.forFeature('healthDashboard', reducers)
  ],
  providers: [
    CasesService,
    ChartsUtilsService,
    HealthDashboardService,
    CPI18nPipe,
    HealthDashboardUtilsService,
    EngagementUtilsService,
    EngagementService,
    FormsService,
    DashboardUtilsService
  ]
})
export class HealthDashboardModule {}
