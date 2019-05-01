import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { IntegrationTypePipe, IntegrationStatusPipe, IntegrationSourceToIconPipe } from './pipes';
import {
  IntegrationsDeleteComponent,
  IntegrationsActionBoxComponent,
  IntegrationsSyncNowButtonComponent,
  IntegrationRequiredFieldsComponent
} from './components';

@NgModule({
  declarations: [
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent,
    IntegrationSourceToIconPipe,
    IntegrationsActionBoxComponent,
    IntegrationsSyncNowButtonComponent,
    IntegrationRequiredFieldsComponent
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent,
    IntegrationSourceToIconPipe,
    IntegrationsActionBoxComponent,
    IntegrationsSyncNowButtonComponent,
    IntegrationRequiredFieldsComponent
  ]
})
export class CommonIntegrationsModule {}
