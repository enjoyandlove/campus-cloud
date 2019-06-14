import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducers, effects } from './store';
import { SharedModule } from '@shared/shared.module';
import { WallsIntegrationsListComponent } from './list';
import { WallsIntegrationsEditComponent } from './edit';
import { WallsIntegrationsCreateComponent } from './create';
import { WallsIntegrationsDeleteComponent } from './delete';
import { WallsIntegrationsService } from './walls-integrations.service';
import { WallsIntegrationsRoutingModule } from './walls-integrations-routing.module';
import { LibsWallsIntegrationsModule } from '@libs/integrations/walls/walls-integrations.module';

@NgModule({
  declarations: [
    WallsIntegrationsEditComponent,
    WallsIntegrationsListComponent,
    WallsIntegrationsDeleteComponent,
    WallsIntegrationsCreateComponent
  ],
  providers: [WallsIntegrationsService],
  imports: [
    CommonModule,
    SharedModule,
    LibsWallsIntegrationsModule,
    WallsIntegrationsRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('wallsIntegrations', reducers)
  ]
})
export class WallsIntegrationsModule {}
