import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import {
  AdminService,
  SchoolService,
  StoreService,
} from '../../shared/services';
import { SharedModule } from '../../shared/shared.module';

import { ControlPanelComponent } from './controlpanel.component';
import { ControlPanelRoutingModule } from './controlpanel.routing.module';
import { ControlPanelService } from './controlpanel.service';

@NgModule({
  declarations: [ControlPanelComponent],
  imports: [
    RouterModule,
    ControlPanelRoutingModule,
    CommonModule,
    SharedModule,
  ],
  providers: [ControlPanelService, AdminService, StoreService, SchoolService],
})
export class ControlPanelModule {}
