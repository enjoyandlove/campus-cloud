import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';
import { ModalService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { IntegrationsService } from './integrations.service';
import { AnnouncementsIntegrationListComponent } from './list';
import { AnnouncementsIntegrationDeleteComponent } from './delete';
import { CommonIntegrationUtilsService } from '@libs/integrations/common/providers';
import { AnnouncementsIntegrationCreateComponent } from './create/create.component';
import { AnnouncementIntegrationsRoutingModule } from './integrations-routing.module';
import { CommonIntegrationsModule } from '@libs/integrations/common/common-integrations.module';
import { IntegrationsListComponent, AnnouncementsIntegrationFormComponent } from './components';

@NgModule({
  entryComponents: [
    AnnouncementsIntegrationDeleteComponent,
    AnnouncementsIntegrationCreateComponent
  ],
  providers: [IntegrationsService, ModalService, CommonIntegrationUtilsService],
  declarations: [
    IntegrationsListComponent,
    AnnouncementsIntegrationListComponent,
    AnnouncementsIntegrationFormComponent,
    AnnouncementsIntegrationDeleteComponent,
    AnnouncementsIntegrationCreateComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    CommonIntegrationsModule,
    EffectsModule.forFeature(effects),
    AnnouncementIntegrationsRoutingModule,
    StoreModule.forFeature('announcementIntegrations', reducers)
  ]
})
export class AnnouncementIntegrationsModule {}
