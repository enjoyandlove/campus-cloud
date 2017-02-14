import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { ControlPanelRoutingModule } from './controlpanel.routing.module';

import { ControlPanelComponent } from './controlpanel.component';
import { ControlPanelService } from './controlpanel.service';

@NgModule({
  declarations: [ ControlPanelComponent ],
  imports: [ RouterModule, ControlPanelRoutingModule, CommonModule,
  SharedModule ],
  providers: [ ControlPanelService ],
})
export class ControlPanelModule {}
