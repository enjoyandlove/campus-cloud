import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ContentUtilsProviders, IntegrationDataService } from './providers';
import { ResourceExternalAppOpenModule } from './components/resource-external-app-open/resource-external-app-open.module';

import {
  ResourceSelectorComponent,
  ResourceSelectorItemComponent,
  ResourceSelectorButtonComponent,
  ResourceSelectorTypeWebComponent,
  ResourceSelectorTypeSingleComponent,
  ResourceSelectorTypeResourceComponent,
  ResourceSelectorTypeExternalComponent,
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
    ResourceTypeServiceByCategoryComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, ResourceExternalAppOpenModule],
  providers: [ContentUtilsProviders, IntegrationDataService]
})
export class LibsStudioModule {}
