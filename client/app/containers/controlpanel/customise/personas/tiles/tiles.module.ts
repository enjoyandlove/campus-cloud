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
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileAddButtonComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileHoverComponent,
    PersonasTileAddButtonComponent
  ],
  providers: []
})
export class PersonasTilesModule {}
