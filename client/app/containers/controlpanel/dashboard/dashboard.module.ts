import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { DashboardService } from './dashboard.service';
import { DashboardUtilsService } from './dashboard.utils.service';

import {
  DashboardTopClubsComponent,
  DashboardCampuTileComponent,
  DashboardTopEventsComponent,
  DashboardAssessmentComponent,
  DashboardTopResourceComponent,
  DashboardTopServicesComponent,
  DashboardIntegrationsComponent,
  DashboardSocialActivyComponent,
  DashboardTopOrientationComponent,
  DashboardSocialActivyChartComponent,
  DashboardGeneralInformationComponent,
  DashboardDownloadsRegistrationComponent,
  DashboardTopResourceTitleComponent
} from './components';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing.module';
import { EngagementModule } from './../assess/engagement/engagement.module';

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardGeneralInformationComponent,
    DashboardTopEventsComponent,
    DashboardTopServicesComponent,
    DashboardTopResourceComponent,
    DashboardAssessmentComponent,
    DashboardIntegrationsComponent,
    DashboardCampuTileComponent,
    DashboardTopClubsComponent,
    DashboardDownloadsRegistrationComponent,
    DashboardSocialActivyComponent,
    DashboardSocialActivyChartComponent,
    DashboardTopOrientationComponent,
    DashboardTopResourceTitleComponent
  ],

  imports: [CommonModule, SharedModule, DashboardRoutingModule, EngagementModule],

  providers: [DashboardService, DashboardUtilsService]
})
export class DashboardModule {}
