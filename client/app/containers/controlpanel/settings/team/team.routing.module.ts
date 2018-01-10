import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamCreateComponent } from './create';
import { TeamEditComponent } from './edit';
import { TeamListComponent } from './list';


const appRoutes: Routes = [
  { path: '', component: TeamListComponent },
  { path: 'invite', component: TeamCreateComponent },
  { path: ':adminId/edit', component: TeamEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
