import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { SETTINGS_TESTERS } from '@shared/constants';
import { reducerMap, TestersEffects } from './store';
import { CampusTestersService } from './campus-testers.service';
import { TestersListComponent } from './list/testers-list.component';
import { CampusTestersRoutingModule } from './campus-testers-routing.module';
import { TestUsersComponent } from './list/components/test-users/test-users.component';
import { TestersActionBoxComponent } from './list/components/testers-action-box/testers-action-box.component';

@NgModule({
  declarations: [TestersListComponent, TestUsersComponent, TestersActionBoxComponent],
  imports: [
    SharedModule,
    CommonModule,
    CampusTestersRoutingModule,
    StoreModule.forFeature(SETTINGS_TESTERS, reducerMap),
    EffectsModule.forFeature([TestersEffects])
  ],
  providers: [CampusTestersService]
})
export class CampusTestersModule {}
