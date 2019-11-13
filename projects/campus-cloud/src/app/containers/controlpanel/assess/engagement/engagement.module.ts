import { ChartsModule } from '@ready-education/ready-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EngagementComponent } from './engagement.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ChartsUtilsService } from '@campus-cloud/shared/services';

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
import { EngagementUtilsService } from './engagement.utils.service';
import { EngagementRoutingModule } from './engagement.routing.module';

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

  imports: [ReactiveFormsModule, ChartsModule, CommonModule, SharedModule, EngagementRoutingModule],

  providers: [ChartsUtilsService, EngagementService, EngagementUtilsService],

  exports: [CPStatsFormatterPipe]
})
export class EngagementModule {}
