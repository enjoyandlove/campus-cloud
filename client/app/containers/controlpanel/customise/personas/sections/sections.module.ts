import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../shared/shared.module';
import {
  PersonasSectionAddButtonComponent,
  PersonasSectionControlsComponent,
  PersonasSectionTitleComponent
} from './components/';
import { SectionUtilsService } from './section.utils.service';
import { PersonasSectionComponent } from './section/section.component';
import { SectionsService } from './sections.service';
import { PersonasTilesModule } from '../tiles/tiles.module';
/*tslint:disable:max-line-length */

@NgModule({
  declarations: [
    PersonasSectionComponent,
    PersonasSectionControlsComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionTitleComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, PersonasTilesModule],
  exports: [
    PersonasSectionComponent,
    PersonasSectionControlsComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionTitleComponent
  ],
  providers: [SectionsService, SectionUtilsService]
})
export class PersonasSectionsModule {}
