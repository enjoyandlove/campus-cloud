import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '@campus-cloud/src/app/shared/shared.module';
import { CommonIntegrationUtilsService } from './../common/providers';
import { CommonIntegrationsModule } from './../common/common-integrations.module';
import { EventIntegrationFormComponent, EventIntegrationsListComponent } from './components';

@NgModule({
  declarations: [EventIntegrationFormComponent, EventIntegrationsListComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CommonIntegrationsModule],
  exports: [
    EventIntegrationFormComponent,
    CommonIntegrationsModule,
    EventIntegrationsListComponent
  ],
  providers: [CommonIntegrationUtilsService]
})
export class EventsIntegrationsModule {}
