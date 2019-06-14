import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClubsMembersComponent } from './list';
import { ClubsMembersEditComponent } from './edit';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ClubsMembersCreateComponent } from './create';
import { ClubsMembersDeleteComponent } from './delete';
import { ClubsMembersRoutingModule } from './members.routing.module';
import { LibsCommmonMembersModule } from '@campus-cloud/libs/members/common/common-members.module';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@campus-cloud/libs/members/common/providers';

@NgModule({
  declarations: [
    ClubsMembersComponent,
    ClubsMembersEditComponent,
    ClubsMembersDeleteComponent,
    ClubsMembersCreateComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    LibsCommmonMembersModule,
    ClubsMembersRoutingModule
  ],

  exports: [
    ClubsMembersComponent,
    ClubsMembersEditComponent,
    ClubsMembersDeleteComponent,
    ClubsMembersCreateComponent
  ],

  providers: [LibsCommonMembersService, LibsCommonMembersUtilsService]
})
export class ClubsMembersModule {}
