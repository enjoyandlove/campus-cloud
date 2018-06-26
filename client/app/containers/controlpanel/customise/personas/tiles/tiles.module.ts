import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../shared/shared.module';
import {
  PersonasTileAddButtonComponent,
  PersonasTileFormComponent,
  PersonasTileHoverComponent,
  PersonasTileTypeTextComponent
} from './components';
import { PseronasTileBaseComponent } from './components/tile-base/tile-base.component';
import { PersonasTileContentComponent } from './components/tile-content/tile-content.component';
import { PersonasTileCreateComponent } from './create';
import { PersonasTileComponent } from './tile/tile.component';
import { TilesService } from './tiles.service';
import { TilesUtilsService } from './tiles.utils.service';

@NgModule({
  declarations: [
    PersonasTileTypeTextComponent,
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
    PersonasTileTypeTextComponent,
    PersonasTileContentComponent,
    PseronasTileBaseComponent,
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileAddButtonComponent
  ],
  providers: [TilesUtilsService, TilesService]
})
export class PersonasTilesModule {}
