import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EventIntegrationFormComponent } from './components';
import { SharedModule } from '@client/app/shared/shared.module';
import { CommonIntegrationUtilsService } from './../common/providers';
import { CommonIntegrationsModule } from './../common/common-integrations.module';

@NgModule({
  declarations: [EventIntegrationFormComponent],
  imports: [CommonModule, ReactiveFormsModule, SharedModule, CommonIntegrationsModule],
  exports: [EventIntegrationFormComponent, CommonIntegrationsModule],
  providers: [CommonIntegrationUtilsService]
})
export class EventsIntegrationsModule {}
