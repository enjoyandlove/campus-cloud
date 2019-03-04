import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';
import { ModalService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { IntegrationsListComponent } from './components';
import { IntegrationsService } from './integrations.service';
import { AnnouncementsIntegrationListComponent } from './list';
import { AnnouncementsIntegrationDeleteComponent } from './delete';
import { AnnouncementIntegrationsRoutingModule } from './integrations-routing.module';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';

@NgModule({
  entryComponents: [AnnouncementsIntegrationDeleteComponent],
  providers: [IntegrationsService, ModalService],
  declarations: [
    IntegrationsListComponent,
    AnnouncementsIntegrationListComponent,
    AnnouncementsIntegrationDeleteComponent
  ],
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
