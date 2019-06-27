import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { PersonasEditComponent } from './edit';
import { PersonasListComponent } from './list';
import { PersonasDeleteComponent } from './delete';
import { PersonasService } from './personas.service';
import { PersonasTilesModule } from './tiles/tiles.module';
import { PersonasUtilsService } from './personas.utils.service';
import { PersonasRoutingModule } from './personas.routing.module';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { PersonasListActionBoxComponent } from './list/components';
import { PersonasCreateComponent } from './create/create.component';
import { PersonasSectionsModule } from './sections/sections.module';
import { PersonasDetailsComponent } from './details/details.component';
import { SectionUtilsService } from './sections/section.utils.service';
import { PersonasFormComponent } from './components/personas-form/personas-form.component';
import { PersonasAmplitudeService } from '@controlpanel/customise/personas/personas.amplitude.service';

@NgModule({
  declarations: [
    PersonasFormComponent,
    PersonasListComponent,
    PersonasEditComponent,
    PersonasDeleteComponent,
    PersonasCreateComponent,
    PersonasDetailsComponent,
    PersonasListActionBoxComponent
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

  providers: [PersonasService, PersonasUtilsService, SectionUtilsService, PersonasAmplitudeService]
})
export class PersonasModule {}
