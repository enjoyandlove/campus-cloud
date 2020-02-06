import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotifyComponent } from './notify.component';
import { NotifyRoutingModule } from './notify.routing.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';

@NgModule({
  declarations: [NotifyComponent],

  imports: [CommonModule, SharedModule, NotifyRoutingModule],

  providers: []
})
export class NotifyModule {}
