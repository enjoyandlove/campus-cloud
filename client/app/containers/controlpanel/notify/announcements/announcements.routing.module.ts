import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnnouncementsListComponent }  from './list';

const appRoutes: Routes = [

  { path: '', component: AnnouncementsListComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AnnouncementsRoutingModule {}
