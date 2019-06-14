import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/src/app/shared/shared.module';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import {
  WallsIntegrationFormComponent,
  WallsIntegrationListComponent
} from '@libs/integrations/walls/components';

import { WallsSocialPostCategoryIdToNamePipe } from './pipes';

@NgModule({
  declarations: [
    WallsIntegrationFormComponent,
    WallsIntegrationListComponent,
    WallsSocialPostCategoryIdToNamePipe
  ],
  imports: [CommonModule, ReactiveFormsModule, CommonIntegrationsModule, SharedModule],
  exports: [WallsIntegrationFormComponent, CommonIntegrationsModule, WallsIntegrationListComponent],
  providers: [CommonIntegrationUtilsService]
})
export class LibsWallsIntegrationsModule {}
