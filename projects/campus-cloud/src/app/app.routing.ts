import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { pageTitle } from '@campus-cloud/shared/constants';
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

  {
    path: 'unsubscribe',
    loadChildren: () =>
      import('./containers/unsubscribe/unsubscribe.module').then((m) => m.UnsubscribeModule)
  },

  { path: 'logout', component: LogoutComponent },

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: true,
      anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class TopLevelRoutesModule {}
