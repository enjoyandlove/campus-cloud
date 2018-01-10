import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * CRUD
 */
import { LinksListComponent } from './list';
// import { LinksEditComponent }  from './edit';
// import { LinksDeleteComponent }  from './delete';

const appRoutes: Routes = [
  { path: 'import', redirectTo: '', pathMatch: 'full' },

  { path: '', component: LinksListComponent },
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class LinksRoutingModule {}
