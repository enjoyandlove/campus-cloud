import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminService, SchoolService, StoreService } from '../../shared/services';
import { SharedModule } from '../../shared/shared.module';

import { ControlPanelComponent } from './controlpanel.component';
import { ControlPanelRoutingModule } from './controlpanel.routing.module';
import { ControlPanelService } from './controlpanel.service';
import { ToastModule } from '../../ready/toast/toast.module';

@NgModule({
  declarations: [ControlPanelComponent],
  imports: [
    RouterModule,
    ControlPanelRoutingModule,
    CommonModule,
    SharedModule,
    ToastModule.forRoot()
  ],
  providers: [ControlPanelService, AdminService, StoreService, SchoolService]
})
export class ControlPanelModule {}
