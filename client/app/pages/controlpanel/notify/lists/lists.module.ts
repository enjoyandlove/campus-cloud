import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { ListsListComponent }  from './list';
import { ListsDeleteComponent }  from './delete';

import {
  ListsListActionBoxComponent
} from './list/components';

import { ListsService } from './lists.service';
import { ListsRoutingModule } from './lists.routing.module';

@NgModule({
  declarations: [ ListsListComponent, ListsListActionBoxComponent, ListsDeleteComponent ],

  imports: [ CommonModule, SharedModule, ListsRoutingModule ],

  providers: [ ListsService ],
})
export class ListsModule {}
