import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import {
  ResourceSelectorComponent,
  ResourceSelectorItemComponent,
  ResourceSelectorButtonComponent,
  ResourceSelectorTypeWebComponent,
  ResourceSelectorTypeSingleComponent,
  ResourceSelectorTypeResourceComponent,
  ResourceTypeServiceByCategoryComponent
} from './components';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  exports: [
    ResourceSelectorComponent,
    ResourceSelectorItemComponent,
    ResourceSelectorButtonComponent,
    ResourceSelectorTypeWebComponent,
    ResourceSelectorTypeSingleComponent,
    ResourceSelectorTypeResourceComponent,
    ResourceTypeServiceByCategoryComponent
  ],
  declarations: [
    ResourceSelectorComponent,
    ResourceSelectorItemComponent,
    ResourceSelectorButtonComponent,
    ResourceSelectorTypeWebComponent,
    ResourceSelectorTypeSingleComponent,
    ResourceSelectorTypeResourceComponent,
    ResourceTypeServiceByCategoryComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule]
})
export class LibsStudioModule {}
