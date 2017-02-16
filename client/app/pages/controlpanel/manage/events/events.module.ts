import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { EventsListComponent }  from './list';
import { EventsCreateComponent } from './create';
import { EventsDeleteComponent }  from './delete';
import { EventsDetailsComponent }  from './details';

import { EventsService } from './events.service';
import { EventsRoutingModule } from './events.routing.module';

@NgModule({
  declarations: [ EventsListComponent, EventsCreateComponent, EventsDetailsComponent,
  EventsDeleteComponent ],

  imports: [ CommonModule, SharedModule, EventsRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ EventsService ],
})
export class EventsModule {}
