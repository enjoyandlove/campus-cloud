import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../../shared/shared.module';

import { ClubsMembersCreateComponent } from './create';
import { ClubsMembersDeleteComponent } from './delete';
import { ClubsMembersEditComponent } from './edit';
import { ClubsMembersComponent } from './list';
import { ClubsMembersActionBoxComponent } from './list/components';
import { ClubsMembersRoutingModule } from './members.routing.module';
import { MembersService } from './members.service';

/**
 * CRUD
 */

@NgModule({
  declarations: [
    ClubsMembersComponent,
    ClubsMembersActionBoxComponent,
    ClubsMembersCreateComponent,
    ClubsMembersEditComponent,
    ClubsMembersDeleteComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    ClubsMembersRoutingModule,
  ],

  providers: [MembersService],
})
export class ClubsMembersModule {}
