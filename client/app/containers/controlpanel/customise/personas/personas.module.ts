import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PersonasListComponent } from './list';
import { PersonasEditComponent } from './edit';
import { PersonasDeleteComponent } from './delete';
import { PersonasService } from './personas.service';
import { SharedModule } from '../../../../shared/shared.module';
import { PersonasUtilsService } from './personas.utils.service';
import { PersonasRoutingModule } from './personas.routing.module';
import { PersonasListActionBoxComponent } from './list/components';
import { PersonasCreateComponent } from './create/create.component';
import { PersonasDetailsComponent } from './details/details.component';
import { PersonasFormComponent } from './components/personas-form/personas-form.component';
import { PersonasSectionComponent } from './details/components/section/section.component';
import {
  PersonasSectionTileComponent,
  PersonasSectionTitleComponent,
  PersonasSectionControlsComponent,
  PersonasSectionAddButtonComponent,
  PersonasSectionTileHoverComponent,
  PersonasSectionAddTileButtonComponent
} from './details/components/section';

@NgModule({
  declarations: [
    PersonasFormComponent,
    PersonasListComponent,
    PersonasEditComponent,
    PersonasDeleteComponent,
    PersonasCreateComponent,
    PersonasDetailsComponent,
    PersonasSectionComponent,
    PersonasSectionTileComponent,
    PersonasSectionTitleComponent,
    PersonasListActionBoxComponent,
    PersonasSectionControlsComponent,
    PersonasSectionTileHoverComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionAddTileButtonComponent
  ],

  imports: [CommonModule, SharedModule, RouterModule, ReactiveFormsModule, PersonasRoutingModule],

  providers: [PersonasService, PersonasUtilsService]
})
export class PersonasModule {}
