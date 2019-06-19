import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ContentUtilsProviders, IntegrationDataService } from './providers';

import {
  ResourceSelectorComponent,
  ResourceSelectorItemComponent,
  ResourceSelectorButtonComponent,
  ResourceSelectorTypeWebComponent,
  ResourceSelectorTypeSingleComponent,
  ResourceSelectorTypeResourceComponent,
  ResourceSelectorTypeExternalComponent,
  ResourceTypeServiceByCategoryComponent,
  PersonasResourceExternalAppOpenComponent
} from './components';

@NgModule({
  exports: [
    ResourceSelectorComponent,
    ResourceSelectorItemComponent,
    ResourceSelectorButtonComponent,
    ResourceSelectorTypeWebComponent,
    ResourceSelectorTypeSingleComponent,
    ResourceSelectorTypeResourceComponent,
    ResourceSelectorTypeExternalComponent,
    ResourceTypeServiceByCategoryComponent
  ],
  declarations: [
    ResourceSelectorComponent,
    ResourceSelectorItemComponent,
    ResourceSelectorButtonComponent,
    ResourceSelectorTypeWebComponent,
    ResourceSelectorTypeSingleComponent,
    ResourceSelectorTypeResourceComponent,
    ResourceSelectorTypeExternalComponent,
    ResourceTypeServiceByCategoryComponent,
    PersonasResourceExternalAppOpenComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  providers: [ContentUtilsProviders, IntegrationDataService]
})
export class LibsStudioModule {}
