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
    data: { zendesk: 'experiences' },
    component: PersonasListComponent
  },
  {
    path: 'create',
    data: { zendesk: 'experiences' },
    component: PersonasCreateComponent
  },
  {
    path: ':personaId',
    data: { zendesk: 'experiences' },
    component: PersonasDetailsComponent
  },
  {
    path: ':personaId/edit',
    data: { zendesk: 'experiences' },
    component: PersonasEditComponent
  },
  {
    path: ':personaId/tiles',
    data: { zendesk: 'experiences' },
    component: PersonasTileCreateComponent
  },
  {
    path: ':personaId/tiles/:tileId/edit',
    data: { zendesk: 'experiences' },
    component: PersonasTileEditComponent
  },
  {
    path: ':personaId/tiles/:tileId',
    data: { zendesk: 'experiences' },
    component: PersonasEditComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PersonasRoutingModule {}
