import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { pageTitle } from '@campus-cloud/shared/constants';
import { LocationExistsGuard } from './guards';
import { LocationsInfoComponent } from './info';
import { LocationsListComponent } from './list';
import { LocationsEditComponent } from './edit';
import { LocationsCreateComponent } from './create';
import { LocationsExcelComponent } from './excel';

const appRoutes: Routes = [
  {
    path: '',
    component: LocationsListComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS, amplitude: 'IGNORE' }
  },
  {
    path: 'create',
    component: LocationsCreateComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS, amplitude: 'IGNORE' }
  },
  {
    path: ':locationId/edit',
    canActivate: [LocationExistsGuard],
    component: LocationsEditComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS, amplitude: 'IGNORE' }
  },
  {
    path: ':locationId/info',
    canActivate: [LocationExistsGuard],
    component: LocationsInfoComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS, amplitude: 'Info' }
  },
  {
    path: 'categories',
    data: { zendesk: 'categories' },
    loadChildren: () => import('./categories/categories.module').then((m) => m.CategoriesModule)
  },
  {
    path: 'import/excel',
    component: LocationsExcelComponent,
    data: { zendesk: 'locations', title: pageTitle.MANAGE_LOCATIONS, amplitude: 'IGNORE' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class LocationsRoutingModule {}
