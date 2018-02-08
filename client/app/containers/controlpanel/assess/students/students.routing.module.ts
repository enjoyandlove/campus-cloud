import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StudentsListComponent } from './list';
import { StudentsProfileComponent } from './profile';

const studentsRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'Students List' },
    component: StudentsListComponent,
  },

  {
    path: ':studentId',
    data: { zendesk: 'Student Profile' },
    component: StudentsProfileComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(studentsRoutes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {}
