import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../../../../../shared/shared.module';
import { PersonasTileFormComponent } from './components';
import { PersonasTileCreateComponent } from './create';

@NgModule({
  declarations: [PersonasTileCreateComponent, PersonasTileFormComponent],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [PersonasTileCreateComponent, PersonasTileFormComponent],
  providers: []
})
export class TilesModule {}
