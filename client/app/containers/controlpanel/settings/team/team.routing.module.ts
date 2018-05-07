import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamCreateComponent } from './create';
import { TeamEditComponent } from './edit';
import { TeamListComponent } from './list';

const appRoutes: Routes = [
  { path: '', component: TeamListComponent, data: { zendesk: 'team' } },
  {
    path: 'invite',
    component: TeamCreateComponent,
    data: { zendesk: 'team' },
  },
  {
    path: ':adminId/edit',
    component: TeamEditComponent,
    data: { zendesk: 'tema' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class TeamRoutingModule {}
