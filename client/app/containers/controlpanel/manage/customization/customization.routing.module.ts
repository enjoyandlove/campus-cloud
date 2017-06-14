import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CustomizationListComponent }  from './list';

const appRoutes: Routes = [
  { path: '', component: CustomizationListComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CustomizationRoutingModule {}
