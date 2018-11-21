import { NgModule } from '@angular/core';

import { ClubsModule } from '../../clubs/clubs.module';
import { ServicesMembersComponent } from './services-members.component';
import { ClubsMembersModule } from '../../clubs/members/members.module';

@NgModule({
  declarations: [ServicesMembersComponent],

  imports: [ClubsModule, ClubsMembersModule]
})
export class ServicesMembersModule {}
