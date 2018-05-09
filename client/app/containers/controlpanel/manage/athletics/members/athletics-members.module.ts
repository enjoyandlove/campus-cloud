import { NgModule } from '@angular/core';

import { AthleticsMembersComponent } from './athletics-members.component';
import { ClubsMembersModule } from '../../clubs/members/members.module';
import { AthleticsMembersRoutingModule } from './athletics-members.routing.module';

@NgModule({
  declarations: [AthleticsMembersComponent],

  imports: [AthleticsMembersRoutingModule, ClubsMembersModule]
})
export class AthleticsMembersModule {}
