import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { isProd } from '@app/config/env';
import { pageTitle } from '@shared/constants';
import { LoginComponent, LogoutComponent, LostPasswordComponent } from './containers/auth';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./containers/controlpanel/controlpanel.module').then((m) => m.ControlPanelModule)
  },

  {
    path: 'login',
    component: LoginComponent,
    data: { zendesk: 'login', title: pageTitle.LOGIN }
  },

  {
    path: 'lost-password',
    component: LostPasswordComponent,
    data: { zendesk: 'password', title: pageTitle.LOST_PASSWORD }
  },

  {
    path: 'cb',
    loadChildren: () =>
      import('./containers/callback/callback.module').then((m) => m.CallbackModule)
  },

  { path: 'logout', component: LogoutComponent },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: isProd ? PreloadAllModules : null
    })
  ],
  exports: [RouterModule]
})
export class TopLevelRoutesModule {}
