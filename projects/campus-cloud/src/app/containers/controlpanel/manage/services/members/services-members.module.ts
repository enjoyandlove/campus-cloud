import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ServicesListMembersComponent } from './list';
import { ServicesMembersEditComponent } from './edit';
import { ServicesMembersCreateComponent } from './create';
import { ServicesMembersDeleteComponent } from './delete';
import { SharedModule } from '@campus-cloud/src/app/shared/shared.module';
import { LibsCommonMembersService } from '@libs/members/common/providers';
import { LibsCommmonMembersModule } from '@libs/members/common/common-members.module';
import { LibsCommonMembersUtilsService } from '@libs/members/common/providers/common.utils';

@NgModule({
  declarations: [
    ServicesMembersEditComponent,
    ServicesListMembersComponent,
    ServicesMembersCreateComponent,
    ServicesMembersDeleteComponent
  ],

  providers: [LibsCommonMembersUtilsService, LibsCommonMembersService],

  imports: [CommonModule, SharedModule, LibsCommmonMembersModule]
})
export class ServicesMembersModule {}
