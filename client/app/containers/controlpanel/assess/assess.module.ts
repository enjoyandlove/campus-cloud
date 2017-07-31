import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { AssessComponent }  from './assess.component';

import { AssessRoutingModule } from './assess.routing.module';

@NgModule({
  declarations: [ AssessComponent ],

  imports: [ CommonModule, SharedModule, AssessRoutingModule ],

  providers: [ ],
})
export class AssessModule {}
