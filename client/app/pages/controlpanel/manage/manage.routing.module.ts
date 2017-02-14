import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../config/guards';

import { ManageComponent } from './manage.component';
import { ManageServiceComponent } from './services';


const appRoutes: Routes = [
  {
    path: '',
    component: ManageComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', loadChildren: './events/events.module#EventsModule' },
      { path: 'services', component: ManageServiceComponent  },
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
export class ManageRoutingModule {}
