import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { HealthDashboardComponent } from './health-dashboard.component';
import { StatusCardsComponent } from './components';
import { HealthDashboardActionBoxComponent } from './components/health-dashboard-action-box';
import { HealthPassRoutingModule } from './health-dashboard.routing.module';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { DashboardEffects } from './store/effects';
import { reducers } from './store/reducers';
import { CasesService } from '../cases/cases.service';
import { HealthDashboardFormCompletionComponent } from './components/form-completion';
import { EngagementUtilsService } from '../../assess/engagement/engagement.utils.service';
import { EngagementService } from '../../assess/engagement/engagement.service';
import { FormsService } from '../forms';
@NgModule({
  declarations: [
    HealthDashboardComponent,
    HealthDashboardActionBoxComponent,
    StatusCardsComponent,
    HealthDashboardFormCompletionComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HealthPassRoutingModule,
    EffectsModule.forFeature([DashboardEffects]),
    StoreModule.forFeature('healthDashboard', reducers)
  ],
  providers: [CasesService, EngagementUtilsService, EngagementService, FormsService, CPI18nPipe]
})
export class HealthDashboardModule {}
