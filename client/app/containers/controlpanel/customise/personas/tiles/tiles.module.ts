import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  PersonasTileAddButtonComponent,
  PersonasTileContentComponent,
  PersonasTileGuideFormComponent,
  PersonasTileHoverComponent,
  PseronasTileBaseComponent
} from './components';
import { PersonasTileCreateComponent } from './create';
import { PersonasResourceModule } from './resources/resources.module';
import { PersonasTileComponent } from './tile/tile.component';
import { TilesService } from './tiles.service';
import { TilesUtilsService } from './tiles.utils.service';
import { StoreService } from '../../../../../shared/services/store.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { PersonasService } from '../personas.service';
import { SectionUtilsService } from '../sections/section.utils.service';
import { SectionsService } from '../sections/sections.service';
/*tslint:disable:max-line-length */

@NgModule({
  declarations: [
    PersonasTileGuideFormComponent,
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileContentComponent,
    PersonasTileAddButtonComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule, RouterModule, PersonasResourceModule],
  exports: [
    PersonasTileGuideFormComponent,
    PersonasTileContentComponent,
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileAddButtonComponent
  ],
  providers: [
    TilesUtilsService,
    TilesService,
    StoreService,
    SectionUtilsService,
    SectionsService,
    PersonasService
  ]
})
export class PersonasTilesModule {}
