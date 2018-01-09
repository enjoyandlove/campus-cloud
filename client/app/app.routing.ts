import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  LoginComponent,
  LogoutComponent,
  LostPasswordComponent,
} from './containers/auth';

import { CPPreloadStrategy } from './config/strategies/preload.strategy';

const routes: Routes = [
  {
    path: '',
    loadChildren:
      './containers/controlpanel/controlpanel.module#ControlPanelModule',
  },

  { path: 'login', component: LoginComponent },

  { path: 'lost-password', component: LostPasswordComponent },

  {
    path: 'cb',
    loadChildren: './containers/callback/callback.module#CallbackModule',
  },

  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      preloadingStrategy: CPPreloadStrategy,
    }),
  ],
  exports: [RouterModule],
})
export class TopLevelRoutesModule {}
