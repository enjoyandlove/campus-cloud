import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ControlPanelRoutingModule } from './controlpanel.routing.module';

import { ControlPanelComponent } from './controlpanel.component';
import { ControlPanelService } from './controlpanel.service';

import { AdminService, StoreService, SchoolService } from '../../shared/services';

@NgModule({
  declarations: [ ControlPanelComponent ],
  imports: [ RouterModule, ControlPanelRoutingModule, CommonModule,
  SharedModule ],
  providers: [ ControlPanelService, AdminService, StoreService, SchoolService ],
})
export class ControlPanelModule {}
