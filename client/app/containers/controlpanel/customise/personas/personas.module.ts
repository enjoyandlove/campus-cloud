import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PersonasFormComponent } from './components/personas-form/personas-form.component';
import { PersonasCreateComponent } from './create/create.component';
import { PersonasDeleteComponent } from './delete';
import {
  PersonasSectionTileComponent,
  PersonasSectionTileHoverComponent
} from './details/components/section';
import { PersonasSectionComponent } from './details/components/section/section.component';
import { PersonasDetailsComponent } from './details/details.component';
import { PersonasEditComponent } from './edit';
import { PersonasListComponent } from './list';
import { PersonasListActionBoxComponent } from './list/components';
import { PersonasRoutingModule } from './personas.routing.module';
import { PersonasService } from './personas.service';
import { PersonasUtilsService } from './personas.utils.service';
import { PersonasSectionsModule } from './sections/sections.module';
import { PersonasTilesModule } from './tiles/tiles.module';
import { SharedModule } from '../../../../shared/shared.module';

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
    PersonasListActionBoxComponent,
    PersonasSectionTileHoverComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    PersonasRoutingModule,
    PersonasSectionsModule,
    PersonasTilesModule
  ],

  providers: [PersonasService, PersonasUtilsService]
})
export class PersonasModule {}
