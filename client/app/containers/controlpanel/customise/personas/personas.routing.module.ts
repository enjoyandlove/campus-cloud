import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonasCreateComponent } from './create';
import { PersonasDetailsComponent } from './details/details.component';
import { PersonasEditComponent } from './edit';
import { PersonasListComponent } from './list';
import { PersonasTileCreateComponent } from './tiles/create/create.component';
import { PersonasTileEditComponent } from './tiles/edit/edit.component';

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
    path: ':personaId',
    data: { zendesk: 'personas' },
    component: PersonasDetailsComponent
  },
  {
    path: ':personaId/edit',
    data: { zendesk: 'personas' },
    component: PersonasEditComponent
  },
  {
    path: ':personaId/tiles',
    data: { zendesk: 'personas' },
    component: PersonasTileCreateComponent
  },
  {
    path: ':personaId/tiles/:tileId/edit',
    data: { zendesk: 'personas' },
    component: PersonasTileEditComponent
  },
  {
    path: ':personaId/tiles/:tileId',
    data: { zendesk: 'personas' },
    component: PersonasEditComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PersonasRoutingModule {}
