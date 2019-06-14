import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { TodosService } from './todos.service';
import { TodosFormComponent } from './components';
import { OrientationTodosListComponent } from './list';
import { OrientationTodosEditComponent } from './edit';
import { OrientationTodosDeleteComponent } from './delete';
import { OrientationTodosCreateComponent } from './create';
import { TodosListActionBoxComponent } from './list/components/action-box';

import { SharedModule } from '../../../../../shared/shared.module';
import { TodosRoutingModule } from './todos.routing.module';

@NgModule({
  declarations: [
    TodosFormComponent,
    TodosListActionBoxComponent,
    OrientationTodosEditComponent,
    OrientationTodosListComponent,
    OrientationTodosDeleteComponent,
    OrientationTodosCreateComponent
  ],

  imports: [CommonModule, SharedModule, RouterModule, TodosRoutingModule, ReactiveFormsModule],

  providers: [TodosService]
})
export class TodosModule {}
