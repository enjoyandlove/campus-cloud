import { TilesUtilsService } from './tiles.utils.service';
import { PersonasTileContentComponent } from './components/tile-content/tile-content.component';
import { PseronasTileBaseComponent } from './components/tile-base/tile-base.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../shared/shared.module';
import { PersonasTileCreateComponent } from './create';
import { PersonasTileComponent } from './tile/tile.component';

import {
  PersonasTileHoverComponent,
  PersonasTileAddButtonComponent,
  PersonasTileFormComponent
} from './components';

@NgModule({
  declarations: [
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileContentComponent,
    PersonasTileAddButtonComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [
    PersonasTileContentComponent,
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileAddButtonComponent
  ],
  providers: [TilesUtilsService]
})
export class PersonasTilesModule {}
