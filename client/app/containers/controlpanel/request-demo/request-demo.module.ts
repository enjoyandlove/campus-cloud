import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { RequestDemoAssessmentComponent } from './request-demo-assessment';

import { RequestDemoRoutingModule } from './request-demo.routing.module';

@NgModule({
  declarations: [RequestDemoAssessmentComponent],

  imports: [CommonModule, SharedModule, RequestDemoRoutingModule],

  providers: []
})
export class RequestDemoModule {}
