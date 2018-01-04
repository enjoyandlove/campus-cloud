import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TeamListComponent } from './list';
import { TeamEditComponent } from './edit';
import { TeamCreateComponent } from './create';



const appRoutes: Routes = [
        { path: '', component: TeamListComponent },
        { path: 'invite', component: TeamCreateComponent },
        { path: ':adminId/edit', component: TeamEditComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class TeamRoutingModule {}
