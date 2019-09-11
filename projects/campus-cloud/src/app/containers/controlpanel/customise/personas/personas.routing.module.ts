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
    component: PersonasListComponent,
    data: { zendesk: 'experiences', amplitude: 'IGNORE' }
  },
  {
    path: 'create',
    component: PersonasCreateComponent,
    data: { zendesk: 'experiences', amplitude: 'IGNORE' }
  },
  {
    path: ':personaId',
    component: PersonasDetailsComponent,
    data: { zendesk: 'experiences', amplitude: 'IGNORE' }
  },
  {
    path: ':personaId/edit',
    component: PersonasEditComponent,
    data: { zendesk: 'experiences', amplitude: 'IGNORE' }
  },
  {
    path: ':personaId/tiles',
    component: PersonasTileCreateComponent,
    data: { zendesk: 'experiences', amplitude: 'IGNORE' }
  },
  {
    path: ':personaId/tiles/:tileId/edit',
    component: PersonasTileEditComponent,
    data: { zendesk: 'experiences', amplitude: 'IGNORE' }
  }
];
@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule]
})
export class PersonasRoutingModule {}
