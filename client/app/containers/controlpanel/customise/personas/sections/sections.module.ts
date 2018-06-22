/*tslint:disable:max-line-length */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../../../../../shared/shared.module';
import { PersonasSectionComponent } from './section/section.component';

import {
  PersonasSectionTitleComponent,
  PersonasSectionControlsComponent,
  PersonasSectionAddButtonComponent
} from './components/';
import { PersonasTilesModule } from '../tiles/tiles.module';

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
  providers: []
})
export class PersonasSectionsModule {}
