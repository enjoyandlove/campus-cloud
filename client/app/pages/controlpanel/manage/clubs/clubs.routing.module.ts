import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClubsListComponent } from './list';
import { ClubsCreateComponent } from './create';

import { ClubsExcelComponent } from './excel';

const appRoutes: Routes = [
  { path: '', component: ClubsListComponent },

  { path: 'create', component: ClubsCreateComponent },

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
