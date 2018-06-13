import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementsComposeComponent } from './compose/announcements-compose.component';

import { AnnouncementsListComponent } from './list';

const appRoutes: Routes = [
  {
    path: '',
    component: AnnouncementsListComponent,
    data: { zendesk: 'notify' }
  },
  {
    path: 'compose',
    component: AnnouncementsComposeComponent,
    data: { zendesk: 'notify' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class AnnouncementsRoutingModule {}
