import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { ManageComponent }  from './manage.component';
import { ManageServiceComponent } from './services';

import { ManageRoutingModule } from './manage.routing.module';

@NgModule({
  declarations: [ ManageComponent, ManageServiceComponent ],

  imports: [ CommonModule, SharedModule, ManageRoutingModule ],

  providers: [ ],
})
export class ManageModule {}
