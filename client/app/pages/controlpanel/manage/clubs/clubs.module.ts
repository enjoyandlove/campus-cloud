import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

/**
 * CRUD
 */
import { ClubsListComponent } from './list';
import { ClubsEditComponent } from './edit';
import { ClubsCreateComponent } from './create';
import { ClubsDeleteComponent } from './delete';

import { ClubsExcelComponent } from './excel';

import {
  ClubsListActionBoxComponent
} from './list/components';

import {
  ClubsExcelModalComponent
} from './excel/components';


import { ClubsService } from './clubs.service';
import { ClubsRoutingModule } from './clubs.routing.module';

@NgModule({
  declarations: [ ClubsListComponent, ClubsEditComponent, ClubsCreateComponent,
  ClubsDeleteComponent, ClubsListActionBoxComponent, ClubsExcelModalComponent,
  ClubsExcelComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule, ClubsRoutingModule ],

  providers: [ ClubsService ],
})
export class ClubsModule {}
