import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent, LogoutComponent } from './pages/auth';

const routes: Routes = [
  { path: '', loadChildren: './pages/controlpanel/controlpanel.module#ControlPanelModule' },

  { path: 'login', component: LoginComponent },

  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class TopLevelRoutesModule {}

