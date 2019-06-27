import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers } from './store';
import { effects } from './store/effects';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { ItemsIntegrationEditComponent } from './edit';
import { ItemsIntegrationsListComponent } from './list';
import { ItemsIntegrationsCreateComponent } from './create';
import { ItemsIntegrationsService } from './integrations.service';
import { ItemsIntegrationRoutingModule } from './items-integrations.routing.module';
import { CommonIntegrationUtilsService } from '@campus-cloud/libs/integrations/common/providers';
import { EventsIntegrationsModule } from '@campus-cloud/libs/integrations/events/events-integrations.module';

@NgModule({
  declarations: [
    ItemsIntegrationEditComponent,
    ItemsIntegrationsListComponent,
    ItemsIntegrationsCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ReactiveFormsModule,
    EventsIntegrationsModule,
    ItemsIntegrationRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('itemsIntegrations', reducers)
  ],
  exports: [],
  providers: [ItemsIntegrationsService, CommonIntegrationUtilsService]
})
export class ItemsIntegrationsModule {}
