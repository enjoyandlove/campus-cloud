import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@client/app/shared/shared.module';
import { IntegrationTypePipe, IntegrationStatusPipe } from './pipes';
import {
  IntegrationsListComponent,
  IntegrationsActionBoxComponent,
  IntegrationsDeleteComponent
} from './components';
@NgModule({
  declarations: [
    IntegrationsActionBoxComponent,
    IntegrationsListComponent,
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent
  ],
  imports: [CommonModule, SharedModule],
  exports: [
    IntegrationsActionBoxComponent,
    IntegrationsListComponent,
    IntegrationTypePipe,
    IntegrationStatusPipe,
    IntegrationsDeleteComponent
  ]
})
export class CommonIntegrationsModule {}
