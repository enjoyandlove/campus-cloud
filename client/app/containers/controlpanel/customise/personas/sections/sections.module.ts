/*tslint:disable:max-line-length */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from './../../../../../shared/shared.module';

import {
  PersonasSectionAddButtonComponent,
  PersonasSectionControlsComponent,
  PersonasSectionTitleComponent
} from './components/';

@NgModule({
  declarations: [
    PersonasSectionControlsComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionTitleComponent
  ],
  imports: [CommonModule, SharedModule, ReactiveFormsModule],
  exports: [
    PersonasSectionControlsComponent,
    PersonasSectionAddButtonComponent,
    PersonasSectionTitleComponent
  ],
  providers: []
})
export class PersonasSectionsModule {}
