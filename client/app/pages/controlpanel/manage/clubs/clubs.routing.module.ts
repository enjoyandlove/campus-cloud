import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsListComponent } from './list';
import { ClubsEditComponent } from './edit';
import { ClubsExcelComponent } from './excel';
import { ClubsCreateComponent } from './create';

const appRoutes: Routes = [
  { path: '', component: ClubsListComponent },

  { path: 'create', component: ClubsCreateComponent },

  { path: ':clubId/edit', component: ClubsEditComponent },

  { path: 'import/excel', component: ClubsExcelComponent },

  { path: ':clubId', loadChildren: './details/details.module#ClubsDetailsModule' }

];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ClubsRoutingModule {}
