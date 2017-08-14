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

import { EngagementService } from './engagement.service';
import { EngagementRoutingModule } from './engagement.routing.module';

@NgModule({
  declarations: [ EngagementComponent, EngagementTopBarComponent,
    EngagementChartComponent, EngagementStatsComponent, EngagementEventsBoxComponent,
    EngagementServicesBoxComponent, EngagementComposeComponent ],

  imports: [ ReactiveFormsModule, CommonModule, SharedModule, EngagementRoutingModule ],

  providers: [ EngagementService ],
})
export class EngagementModule {}