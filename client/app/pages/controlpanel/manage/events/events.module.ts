import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { EventsListComponent }  from './list';
import { EventsCreateComponent } from './create';

import { EventsService } from './events.service';
import { EventsRoutingModule } from './events.routing.module';

@NgModule({
  declarations: [ EventsListComponent, EventsCreateComponent ],

  imports: [ CommonModule, SharedModule, EventsRoutingModule ],

  providers: [ EventsService ],
})
export class EventsModule {}
