import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { AnnouncementsListComponent } from './list';

import { AnnouncementsListActionBoxComponent
} from './list/components';

import { AnnouncementsRoutingModule } from './announcements.routing.module';

import { AnnouncementsService } from './announcements.service';

@NgModule({
  declarations: [ AnnouncementsListComponent, AnnouncementsListActionBoxComponent ],

  imports: [ CommonModule, SharedModule, AnnouncementsRoutingModule ],

  providers: [ AnnouncementsService ],
})
export class AnnouncementsModule {}
