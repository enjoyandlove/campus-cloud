import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { NotifyComponent } from './notify.component';
import { NotifyRoutingModule } from './notify.routing.module';
import { NotifyUtilsService } from './notify.utils.service';

@NgModule({
  declarations: [NotifyComponent],

  imports: [CommonModule, SharedModule, NotifyRoutingModule],

  providers: [NotifyUtilsService]
})
export class NotifyModule {}
