import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { LinksListComponent } from './list';

const appRoutes: Routes = [
  {
    path: 'import',
    redirectTo: '',
    pathMatch: 'full',
    data: { zendesk: 'import links' },
  },

  { path: '', component: LinksListComponent, data: { zendesk: 'Links' } },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class LinksRoutingModule {}
