import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { AnnouncementsListComponent }  from './list';

import { AnnouncementsRoutingModule } from './announcements.routing.module';

@NgModule({
  declarations: [ AnnouncementsListComponent ],

  imports: [ CommonModule, SharedModule, AnnouncementsRoutingModule ],

  providers: [ ],
})
export class AnnouncementsModule {}
