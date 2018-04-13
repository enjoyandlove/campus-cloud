import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { LinksListComponent } from './list';
import { PrivilegesGuard } from '../../../../config/guards';

const appRoutes: Routes = [
  {
    path: 'import',
    redirectTo: '',
    pathMatch: 'full',
    data: { zendesk: 'links' },
  },

  {
    path: '',
    canActivate: [PrivilegesGuard],
    component: LinksListComponent,
    data: { zendesk: 'links' }
  },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class LinksRoutingModule {}
