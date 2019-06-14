import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { IntegrationDataService } from './providers';

import {
  ResourceSelectorComponent,
  ResourceSelectorItemComponent,
  ResourceSelectorButtonComponent,
  ResourceSelectorTypeWebComponent,
  ResourceSelectorTypeSingleComponent,
  ResourceSelectorTypeResourceComponent,
  ResourceTypeServiceByCategoryComponent
} from './components';

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
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  providers: [IntegrationDataService]
})
export class LibsStudioModule {}
