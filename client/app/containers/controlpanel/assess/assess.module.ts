import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

import { AssessComponent }  from './assess.component';

import { EngagementComponent } from './engagement/engagement.component';

import {
  EngagementStatsComponent,
  EngagementChartComponent,
  EngagementTopBarComponent,
  EngagementComposeComponent,
  EngagementEventsBoxComponent,
  EngagementServicesBoxComponent
} from './engagement/components';

import { AssessRoutingModule } from './assess.routing.module';

@NgModule({
  declarations: [ AssessComponent, EngagementComponent, EngagementTopBarComponent,
    EngagementChartComponent, EngagementStatsComponent, EngagementEventsBoxComponent,
    EngagementServicesBoxComponent, EngagementComposeComponent ],

  imports: [ ReactiveFormsModule, CommonModule, SharedModule, AssessRoutingModule ],

  providers: [ ],
})
export class AssessModule {}
