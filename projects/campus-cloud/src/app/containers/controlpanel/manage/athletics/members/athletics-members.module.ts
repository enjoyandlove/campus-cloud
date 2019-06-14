import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { AthleticsListMembersComponent } from './list';
import { AthleticsMembersEditComponent } from './edit';
import { AthleticsMembersDeleteComponent } from './delete';
import { AthleticsMembersCreateComponent } from './create';
import { AthleticsMembersRoutingModule } from './athletics-members.routing.module';
import { LibsCommmonMembersModule } from '@campus-cloud/libs/members/common/common-members.module';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@campus-cloud/libs/members/common/providers';

@NgModule({
  declarations: [
    AthleticsListMembersComponent,
    AthleticsMembersCreateComponent,
    AthleticsMembersEditComponent,
    AthleticsMembersDeleteComponent
  ],

  providers: [LibsCommonMembersService, LibsCommonMembersUtilsService],

  imports: [CommonModule, SharedModule, LibsCommmonMembersModule, AthleticsMembersRoutingModule]
})
export class AthleticsMembersModule {}
