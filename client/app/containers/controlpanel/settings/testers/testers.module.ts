import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { TestersService } from './testers.service';
import { SharedModule } from '@shared/shared.module';
import { SETTINGS_TESTERS } from '@shared/constants';
import { reducerMap, TestersEffects } from './store';
import { TestersRoutingModule } from './testers-routing.module';
import { TestersListComponent } from './list/testers-list.component';
import { TestUsersComponent } from './list/components/test-users/test-users.component';
import { TestersActionBoxComponent } from './list/components/testers-action-box/testers-action-box.component';

@NgModule({
  declarations: [TestersListComponent, TestUsersComponent, TestersActionBoxComponent],
  imports: [
    SharedModule,
    CommonModule,
    TestersRoutingModule,
    StoreModule.forFeature(SETTINGS_TESTERS, reducerMap),
    EffectsModule.forFeature([TestersEffects])
  ],
  providers: [TestersService]
})
export class CampusTestersModule {}
