import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TodosService } from './todos.service';
import { OrientationTodosListComponent } from './list';
import { OrientationTodosEditComponent } from './edit';
import { OrientationTodosDeleteComponent } from './delete';
import { OrientationTodosCreateComponent } from './create';
import { TodosListActionBoxComponent } from './list/components/action-box';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../../shared/shared.module';
import { TodosRoutingModule } from './todos.routing.module';
import { CalendarsModule } from '../../calendars/calendars.module';

@NgModule({
  declarations: [
    TodosListActionBoxComponent,
    OrientationTodosEditComponent,
    OrientationTodosListComponent,
    OrientationTodosDeleteComponent,
    OrientationTodosCreateComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    TodosRoutingModule,
    CalendarsModule
  ],

  providers: [
    TodosService,
  ]
})

export class TodosModule {}
