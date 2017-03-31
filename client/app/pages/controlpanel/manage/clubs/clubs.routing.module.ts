import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsListComponent } from './list';
import { ClubsEditComponent } from './edit';
import { ClubsCreateComponent } from './create';

import { ClubsExcelComponent } from './excel';

const appRoutes: Routes = [
  { path: '', component: ClubsListComponent },

  { path: 'create', component: ClubsCreateComponent },

  { path: ':clubId/edit', component: ClubsEditComponent },

  { path: 'import/excel', component: ClubsExcelComponent },

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
