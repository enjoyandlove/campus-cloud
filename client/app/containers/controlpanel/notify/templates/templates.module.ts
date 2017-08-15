import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { TemplatesListComponent } from './list';
import { TemplatesCreateComponent } from './create';
import { TemplatesDeleteComponent } from './delete';
import { TemplatesComposeComponent } from './compose';

import { TemplatesTopBarComponent } from './list/components';

import { TemplatesRoutingModule } from './templates.routing.module';

import { TemplatesService } from './templates.service';

import { AnnouncementsModule } from '../announcements/announcements.module';

@NgModule({
  declarations: [ TemplatesListComponent, TemplatesTopBarComponent, TemplatesDeleteComponent,
    TemplatesComposeComponent, TemplatesCreateComponent ],

  exports: [ ],

  imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      TemplatesRoutingModule,
      AnnouncementsModule
    ],

  providers: [ TemplatesService ],
})
export class TemplatesModule {}
