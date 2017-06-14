import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { AnnouncementsListComponent } from './list';
import { AnnouncementsConfirmComponent } from './confirm';
import { AnnouncementsComposeComponent } from './compose';

import {
  AnnouncementsListActionBoxComponent
} from './list/components';

import { AnnouncementsRoutingModule } from './announcements.routing.module';

import { AnnouncementsService } from './announcements.service';

@NgModule({
  declarations: [ AnnouncementsListComponent, AnnouncementsListActionBoxComponent,
  AnnouncementsComposeComponent, AnnouncementsConfirmComponent ],

  imports: [ CommonModule, SharedModule, AnnouncementsRoutingModule, ReactiveFormsModule ],

  providers: [ AnnouncementsService ],
})
export class AnnouncementsModule {}
