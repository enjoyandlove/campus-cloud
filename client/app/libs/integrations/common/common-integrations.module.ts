import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@client/app/shared/shared.module';
import { IntegrationTypePipe, IntegrationStatusPipe } from './pipes';
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
    IntegrationsActionBoxComponent,
    IntegrationsSyncNowButtonComponent,
    IntegrationRequiredFieldsComponent
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent,
    IntegrationsActionBoxComponent,
    IntegrationsSyncNowButtonComponent,
    IntegrationRequiredFieldsComponent
  ]
})
export class CommonIntegrationsModule {}
