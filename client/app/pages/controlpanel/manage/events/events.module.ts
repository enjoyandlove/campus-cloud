import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EventsInfoComponent }  from './info';
import { EventsListComponent }  from './list';
import { EventsEditComponent }  from './edit';
import { EventsCreateComponent } from './create';
import { EventsDeleteComponent }  from './delete';
import { EventsExcelComponent }  from './excel';
import { EventsFacebookComponent }  from './facebook';
import { EventsAttendanceComponent }  from './attendance';

import { EventsService } from './events.service';
import { EventsRoutingModule } from './events.routing.module';

@NgModule({
  declarations: [ EventsListComponent, EventsCreateComponent, EventsAttendanceComponent,
  EventsDeleteComponent, EventsInfoComponent, EventsEditComponent, EventsExcelComponent,
   EventsFacebookComponent ],

  imports: [ CommonModule, SharedModule, EventsRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ EventsService ],
})
export class EventsModule {}
