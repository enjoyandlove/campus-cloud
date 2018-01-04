import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/*import { TeamListComponent } from './team/list/index';
import { TeamEditComponent } from './team/edit/index';
import { TeamCreateComponent } from './team/create/index';*/
import { SettingsComponent } from './settings.component';


const appRoutes: Routes = [

    {
        path: 'team',
        component: SettingsComponent,
        children: [
            {
                path: 'team',
                loadChildren: './team/team.module#TeamModule'
            },
        ]
    },
/*    {path: '', component: TeamListComponent},
    {path: 'invite', component: TeamCreateComponent},
    {path: ':adminId/edit', component: TeamEditComponent},*/
];

@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class SettingsRoutingModule {}
