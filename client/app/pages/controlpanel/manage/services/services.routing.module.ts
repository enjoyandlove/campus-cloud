import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { ServicesListComponent } from './list';
import { ServicesEditComponent } from './edit';
import { ServicesInfoComponent } from './info';
import { ServicesCreateComponent } from './create';
import { ServicesAttendanceComponent } from './attendance';

/**
 * Excel
 */
import { ServicesExcelComponent } from './excel';


const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: ServicesListComponent },

  { path: 'create', component: ServicesCreateComponent },
  { path: ':serviceId/info', component: ServicesInfoComponent },
  { path: ':serviceId/edit', component: ServicesEditComponent },
  { path: ':serviceId', component: ServicesAttendanceComponent },

  { path: 'import/excel', component: ServicesExcelComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class ServicesRoutingModule {}
