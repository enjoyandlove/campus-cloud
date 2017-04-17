import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { ListsListComponent }  from './list';

import { ListsRoutingModule } from './lists.routing.module';

@NgModule({
  declarations: [ ListsListComponent ],

  imports: [ CommonModule, SharedModule, ListsRoutingModule ],

  providers: [ ],
})
export class ListsModule {}
