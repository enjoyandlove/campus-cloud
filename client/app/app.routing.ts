import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';

import {
  LoginComponent,
  LogoutComponent,
  PasswordResetComponent
} from './containers/auth';

const routes: Routes = [
  { path: '', loadChildren: './containers/controlpanel/controlpanel.module#ControlPanelModule' },

  { path: 'login', component: LoginComponent },

  { path: 'password-reset', component: PasswordResetComponent },

  { path: 'cb', loadChildren: './containers/callback/callback.module#CallbackModule' },

  { path: 'logout', component: LogoutComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        useHash: true,
        preloadingStrategy: PreloadAllModules
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class TopLevelRoutesModule {}

