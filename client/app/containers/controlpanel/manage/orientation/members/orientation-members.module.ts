import { NgModule } from '@angular/core';

import { OrientationMembersComponent } from './orientation-members.component';
import { ClubsMembersModule } from '../../clubs/members/members.module';
import { OrientationMembersRoutingModule } from './orientation-members.routing.module';

@NgModule({
  declarations: [
    OrientationMembersComponent
  ],

  imports: [
    OrientationMembersRoutingModule,
    ClubsMembersModule
  ],

})
export class OrientationMembersModule {}
