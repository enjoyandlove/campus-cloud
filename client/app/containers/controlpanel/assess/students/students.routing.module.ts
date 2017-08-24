import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsListComponent } from './list';
import { StudentsProfileComponent } from './profile';


const studentsRoutes: Routes = [
  { path: '', component: StudentsListComponent, },

  { path: ':studentId', component: StudentsProfileComponent, }
];
@NgModule({
  imports: [
    RouterModule.forChild(studentsRoutes)
  ],
  exports: [
    RouterModule
  ],
})
export class StudentsRoutingModule { }
