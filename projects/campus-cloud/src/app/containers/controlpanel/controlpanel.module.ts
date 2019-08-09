import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ToastModule } from '../../ready/toast/toast.module';
import { ControlPanelService } from './controlpanel.service';
import { ControlPanelComponent } from './controlpanel.component';
import { ControlPanelRoutingModule } from './controlpanel.routing.module';
import { AdminService, SchoolService, StoreService } from '../../shared/services';

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
