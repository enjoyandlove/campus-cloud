import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsListComponent } from './list';
import { StudentsProfileComponent } from './profile';

const studentsRoutes: Routes = [
  {
    path: '',
    component: StudentsListComponent,
    data: { zendesk: 'Students List', amplitude: 'IGNORE' }
  },

  {
    path: ':studentId',
    component: StudentsProfileComponent,
    data: { zendesk: 'Student Profile', amplitude: 'Student Profile' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(studentsRoutes)],
  exports: [RouterModule]
})
export class StudentsRoutingModule {}
