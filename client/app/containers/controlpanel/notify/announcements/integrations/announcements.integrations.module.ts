import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';
import { SharedModule } from '@shared/shared.module';
import { IntegrationsListComponent } from './components';
import { IntegrationsService } from './integrations.service';
import { AnnouncementsIntegrationListComponent } from './list';
import { AnnouncementIntegrationsRoutingModule } from './integrations-routing.module';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';

@NgModule({
  providers: [IntegrationsService],
  declarations: [IntegrationsListComponent, AnnouncementsIntegrationListComponent],
  imports: [
    CommonModule,
    SharedModule,
    CommonIntegrationsModule,
    EffectsModule.forFeature(effects),
    AnnouncementIntegrationsRoutingModule,
    StoreModule.forFeature('announcementIntegrations', reducers)
  ]
})
export class AnnouncementIntegrationsModule {}
