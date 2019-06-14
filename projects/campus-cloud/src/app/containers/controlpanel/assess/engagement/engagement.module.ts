import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EngagementComponent } from './engagement.component';

import {
  EngagementStatsComponent,
  EngagementTopBarComponent,
  EngagementComposeComponent,
  EngagementEventsBoxComponent,
  EngagementServicesBoxComponent,
  EngagementResourceStatsComponent,
  EngagementOrientationsBoxComponent
} from './components';

import { CPStatsFormatterPipe } from './components/engagement-stats/pipes/stats-formatter.pipe';

import { EngagementService } from './engagement.service';
import { EngagementRoutingModule } from './engagement.routing.module';
import { EngagementUtilsService } from './engagement.utils.service';

@NgModule({
  declarations: [
    EngagementComponent,
    EngagementTopBarComponent,
    EngagementStatsComponent,
    EngagementEventsBoxComponent,
    EngagementServicesBoxComponent,
    EngagementComposeComponent,
    EngagementResourceStatsComponent,
    EngagementOrientationsBoxComponent,
    CPStatsFormatterPipe
  ],

  imports: [ReactiveFormsModule, CommonModule, SharedModule, EngagementRoutingModule],

  providers: [EngagementService, EngagementUtilsService],

  exports: [CPStatsFormatterPipe]
})
export class EngagementModule {}
