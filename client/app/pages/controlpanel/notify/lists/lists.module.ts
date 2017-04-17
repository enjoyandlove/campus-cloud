import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { ListsListComponent }  from './list';
import { ListsEditComponent }  from './edit';
import { ListsCreateComponent }  from './create';
import { ListsDeleteComponent }  from './delete';

import {
  ListsListActionBoxComponent
} from './list/components';

import { ListsService } from './lists.service';
import { ListsRoutingModule } from './lists.routing.module';

@NgModule({
  declarations: [ ListsListComponent, ListsListActionBoxComponent, ListsDeleteComponent,
  ListsCreateComponent, ListsEditComponent ],

  imports: [ CommonModule, SharedModule, ListsRoutingModule, ReactiveFormsModule ],

  providers: [ ListsService ],
})
export class ListsModule {}
