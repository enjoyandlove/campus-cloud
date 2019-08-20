import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TilesService } from './tiles.service';
import { PersonasService } from '../personas.service';
import { PersonasTileCreateComponent } from './create';
import { PersonasTileDeleteComponent } from './delete';
import { TilesUtilsService } from './tiles.utils.service';
import { StoreService } from '@campus-cloud/shared/services';
import { PersonasTileComponent } from './tile/tile.component';
import { SectionsService } from '../sections/sections.service';
import { PersonasTileEditComponent } from './edit/edit.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { PersonasResourceModule } from './resources/resources.module';
import { SectionUtilsService } from '../sections/section.utils.service';
import { LibsStudioModule } from '@campus-cloud/libs/studio/studio.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';
import {
  PersonasTileBaseComponent,
  PersonasTileHoverComponent,
  PersonasTileContentComponent,
  PersonasTileGuideFormComponent,
  PersonasTileAddButtonComponent
} from './components';
@NgModule({
  declarations: [
    PersonasTileComponent,
    PersonasTileBaseComponent,
    PersonasTileEditComponent,
    PersonasTileHoverComponent,
    PersonasTileDeleteComponent,
    PersonasTileCreateComponent,
    PersonasTileContentComponent,
    PersonasTileAddButtonComponent,
    PersonasTileGuideFormComponent
  ],
  imports: [
    CommonModule,
    LayoutsModule,
    SharedModule,
    RouterModule,
    LibsStudioModule,
    ReactiveFormsModule,
    PersonasResourceModule,
    ImageModule.forRoot()
  ],
  exports: [
    PersonasTileComponent,
    PersonasTileBaseComponent,
    PersonasTileEditComponent,
    PersonasTileHoverComponent,
    PersonasTileDeleteComponent,
    PersonasTileCreateComponent,
    PersonasTileContentComponent,
    PersonasTileAddButtonComponent,
    PersonasTileGuideFormComponent
  ],
  providers: [
    TilesService,
    StoreService,
    PersonasService,
    SectionsService,
    TilesUtilsService,
    SectionUtilsService
  ]
})
export class PersonasTilesModule {}
