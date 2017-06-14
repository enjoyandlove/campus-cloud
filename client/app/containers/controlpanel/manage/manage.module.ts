import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { ManageComponent }  from './manage.component';

import { ManageRoutingModule } from './manage.routing.module';

@NgModule({
  declarations: [ ManageComponent ],

  imports: [ CommonModule, SharedModule, ManageRoutingModule ],

  providers: [ ],
})
export class ManageModule {}
