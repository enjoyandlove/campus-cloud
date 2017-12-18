import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EngagementComponent } from './engagement.component';

import {
  EngagementStatsComponent,
  EngagementChartComponent,
  EngagementTopBarComponent,
  EngagementComposeComponent,
  EngagementEventsBoxComponent,
  EngagementServicesBoxComponent
} from './components';

import { CPStatsFormatterPipe } from './components/engagement-stats/pipes/stats-formatter.pipe';


import { EngagementService } from './engagement.service';
import { EngagementRoutingModule } from './engagement.routing.module';

@NgModule({
  declarations: [ EngagementComponent, EngagementTopBarComponent,
    EngagementChartComponent, EngagementStatsComponent, EngagementEventsBoxComponent,
    EngagementServicesBoxComponent, EngagementComposeComponent, CPStatsFormatterPipe ],

  imports: [ ReactiveFormsModule, CommonModule, SharedModule, EngagementRoutingModule ],

  providers: [ EngagementService ],

  exports: [ CPStatsFormatterPipe ]
})
export class EngagementModule {}
