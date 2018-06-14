import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent, LogoutComponent, LostPasswordComponent } from './containers/auth';

const routes: Routes = [
  {
    path: '',
    loadChildren: './containers/controlpanel/controlpanel.module#ControlPanelModule'
  },

  {
    path: 'login',
    data: { zendesk: 'login' },
    component: LoginComponent
  },

  {
    path: 'lost-password',
    data: { zendesk: 'password' },
    component: LostPasswordComponent
  },

  {
    path: 'cb',
    loadChildren: './containers/callback/callback.module#CallbackModule'
  },

  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true
    })
  ],
  exports: [RouterModule]
})
export class TopLevelRoutesModule {}
