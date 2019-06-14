import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  PersonasTileAddButtonComponent,
  PersonasTileContentComponent,
  PersonasTileGuideFormComponent,
  PersonasTileHoverComponent,
  PersonasTileBaseComponent
} from './components';
import { PersonasTileCreateComponent } from './create';
import { PersonasTileDeleteComponent } from './delete';
import { PersonasTileEditComponent } from './edit/edit.component';
import { PersonasResourceModule } from './resources/resources.module';
import { PersonasTileComponent } from './tile/tile.component';
import { TilesService } from './tiles.service';
import { TilesUtilsService } from './tiles.utils.service';
import { StoreService } from '../../../../../shared/services/store.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { PersonasService } from '../personas.service';
import { SectionUtilsService } from '../sections/section.utils.service';
import { SectionsService } from '../sections/sections.service';
import { LibsStudioModule } from '@libs/studio/studio.module';

@NgModule({
  declarations: [
    PersonasTileDeleteComponent,
    PersonasTileEditComponent,
    PersonasTileGuideFormComponent,
    PersonasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileContentComponent,
    PersonasTileAddButtonComponent
  ],
  imports: [
    CommonModule,
    LibsStudioModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    PersonasResourceModule
  ],
  exports: [
    PersonasTileDeleteComponent,
    PersonasTileEditComponent,
    PersonasTileGuideFormComponent,
    PersonasTileContentComponent,
    PersonasTileBaseComponent,
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
