import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { EngagementStudentsListComponent } from './list';


const studentsRoutes: Routes = [
  { path: '', component: EngagementStudentsListComponent, }
];
@NgModule({
  imports: [
    RouterModule.forChild(studentsRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class EngagementStudentsRoutingModule { }
