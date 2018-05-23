import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PersonasListComponent } from './list';
import { PersonasEditComponent } from './edit';
import { PersonasCreateComponent } from './create';

const appRoutes: Routes = [
  {
    path: '',
    data: { zendesk: 'personas' },
    component: PersonasListComponent
  },
  {
    path: 'create',
    data: { zendesk: 'personas' },
    component: PersonasCreateComponent
  },
  {
    path: ':personaId/edit',
    data: { zendesk: 'personas' },
    component: PersonasEditComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PersonasRoutingModule {}
