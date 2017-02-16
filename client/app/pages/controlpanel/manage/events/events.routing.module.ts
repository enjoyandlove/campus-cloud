import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EventsListComponent } from './list';
import { EventsCreateComponent } from './create';
import { EventsDetailsComponent }  from './details';


const appRoutes: Routes = [
  { path: '', component: EventsListComponent  },
  { path: 'create', component: EventsCreateComponent  },
  { path: ':eventId', component: EventsDetailsComponent  },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class EventsRoutingModule {}
