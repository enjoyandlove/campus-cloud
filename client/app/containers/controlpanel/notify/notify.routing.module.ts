import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { NotifyComponent } from './notify.component';


const appRoutes: Routes = [
  // { path: '', redirectTo: 'events', pathMatch: 'full' },

  {
    path: '',
    component: NotifyComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', loadChildren: './announcements/announcements.module#AnnouncementsModule' },
    ]
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class NotifyRoutingModule {}
