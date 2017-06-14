import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { NotifyComponent }  from './notify.component';

import { NotifyRoutingModule } from './notify.routing.module';

@NgModule({
  declarations: [ NotifyComponent ],

  imports: [ CommonModule, SharedModule, NotifyRoutingModule ],

  providers: [ ],
})
export class NotifyModule {}
