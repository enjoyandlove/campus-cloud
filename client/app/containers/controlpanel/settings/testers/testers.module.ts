import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { TestersService } from './testers.service';
import { SETTINGS_TESTERS } from '@shared/constants';
import { reducerMap, TestersEffects } from './store';
import { TestersRoutingModule } from './testers-routing.module';
import { TestersListComponent } from './list/testers-list.component';

@NgModule({
  declarations: [TestersListComponent],
  imports: [
    CommonModule,
    TestersRoutingModule,
    StoreModule.forFeature(SETTINGS_TESTERS, reducerMap),
    EffectsModule.forFeature([TestersEffects])
  ],
  providers: [TestersService]
})
export class TestersModule {}
