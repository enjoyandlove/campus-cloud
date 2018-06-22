import { PersonasTileAddButtonComponent } from './components/tile-add-button/tile-add-button.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../shared/shared.module';
import { PersonasTileFormComponent } from './components';
import { PersonasTileCreateComponent } from './create';
import { PersonasTileComponent } from './tile/tile.component';

@NgModule({
  declarations: [
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileAddButtonComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [
    PersonasTileCreateComponent,
    PersonasTileFormComponent,
    PersonasTileComponent,
    PersonasTileAddButtonComponent
  ],
  providers: []
})
export class PersonasTilesModule {}
