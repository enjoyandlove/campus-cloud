import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers } from './store';
import { effects } from './store/effects';
import { SharedModule } from '@shared/shared.module';
import { EventsIntegrationEditComponent } from './edit';
import { EventsIntegrationsListComponent } from './list';
import { EventsIntegrationsCreateComponent } from './create';
import { IntegrationsService } from './integrations.service';
import { EventIntegrationFormComponent } from './components';
import { EventIntegrationTypePipe } from './pipes/type.pipe';
import { EventIntegrationStatusPipe } from './pipes/status.pipe';
import { IntegrationsUtilsService } from './integrations.utils.service';
import { EventIntegrationRoutingModule } from './integrations.routing.module';

import { EventsIntegrationsModule } from '@libs/integrations/events/events-integrations.module';

@NgModule({
  declarations: [
    EventsIntegrationsListComponent,
    EventsIntegrationsCreateComponent,
    EventIntegrationStatusPipe,
    EventIntegrationTypePipe,
    EventIntegrationFormComponent,
    EventsIntegrationEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
    EventsIntegrationsModule,
    EventIntegrationRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('eventIntegrations', reducers)
  ],
  exports: [],
  providers: [IntegrationsService, IntegrationsUtilsService]
})
export class EventIntegrationsModule {}
