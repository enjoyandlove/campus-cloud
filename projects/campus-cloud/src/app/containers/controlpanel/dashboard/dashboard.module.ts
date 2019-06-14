import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';
import { DashboardBaseComponent } from './base/base.component';
import { DashboardUtilsService } from './dashboard.utils.service';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { EngagementModule } from '../assess/engagement/engagement.module';
import { DashboardOnboardingComponent } from './onboarding/onboarding.component';
import {
  DashboardTopClubsComponent,
  DashboardTopEventsComponent,
  DashboardAssessmentComponent,
  DashboardCampusTileComponent,
  DashboardTopResourceComponent,
  DashboardTopServicesComponent,
  DashboardIntegrationsComponent,
  DashboardSocialActivyComponent,
  DashboardExperienceMenuComponent,
  DashboardTopOrientationComponent,
  DashboardTopResourceTitleComponent,
  DashboardSocialActivyChartComponent,
  DashboardGeneralInformationComponent,
  DashboardDownloadsRegistrationComponent
} from './components';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardBaseComponent,
    DashboardTopClubsComponent,
    DashboardTopEventsComponent,
    DashboardAssessmentComponent,
    DashboardCampusTileComponent,
    DashboardOnboardingComponent,
    DashboardTopResourceComponent,
    DashboardTopServicesComponent,
    DashboardIntegrationsComponent,
    DashboardSocialActivyComponent,
    DashboardExperienceMenuComponent,
    DashboardTopOrientationComponent,
    DashboardTopResourceTitleComponent,
    DashboardSocialActivyChartComponent,
    DashboardGeneralInformationComponent,
    DashboardDownloadsRegistrationComponent
  ],

  imports: [CommonModule, SharedModule, DashboardRoutingModule, EngagementModule],

  providers: [DashboardService, DashboardUtilsService]
})
export class DashboardModule {}
