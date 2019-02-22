import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@client/app/shared/shared.module';
import { IntegrationTypePipe, IntegrationStatusPipe } from './pipes';
import {
  IntegrationsDeleteComponent,
  IntegrationsActionBoxComponent,
  IntegrationsSyncNowButtonComponent
} from './components';

@NgModule({
  declarations: [
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent,
    IntegrationsActionBoxComponent,
    IntegrationsSyncNowButtonComponent
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent,
    IntegrationsActionBoxComponent,
    IntegrationsSyncNowButtonComponent
  ]
})
export class CommonIntegrationsModule {}
