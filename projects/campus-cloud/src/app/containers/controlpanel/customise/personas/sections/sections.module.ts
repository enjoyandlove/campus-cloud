import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SortablejsModule } from 'ngx-sortablejs';
import { SharedModule } from './../../../../../shared/shared.module';
import { TilesService } from './../tiles/tiles.service';
import { TilesUtilsService } from './../tiles/tiles.utils.service';
import {
  PersonasSectionAddButtonComponent,
  PersonasSectionControlsComponent,
  PersonasSectionTitleComponent
} from './components/';
import { PersonasSectioDeleteComponent } from './delete/delete.component';
import { SectionUtilsService } from './section.utils.service';
import { PersonasSectionComponent } from './section/section.component';
import { SectionsService } from './sections.service';
import { PersonasTilesModule } from '../tiles/tiles.module';

@NgModule({
  declarations: [
    PersonasSectioDeleteComponent,
    PersonasSectionComponent,
    PersonasSectionControlsComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionTitleComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, PersonasTilesModule, SortablejsModule],
  exports: [
    PersonasSectionComponent,
    PersonasSectioDeleteComponent,
    PersonasSectionControlsComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionTitleComponent
  ],
  providers: [SectionsService, SectionUtilsService, TilesService, TilesUtilsService]
})
export class PersonasSectionsModule {}
