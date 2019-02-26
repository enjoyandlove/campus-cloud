import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { reducer } from './store/testers.reducers';
import { TestersRoutingModule } from './testers-routing.module';
import { TestersListComponent } from './list/testers-list.component';

export const SETTINGS_TESTERS = 'settings.testers';

@NgModule({
  declarations: [TestersListComponent],
  imports: [CommonModule, TestersRoutingModule, StoreModule.forFeature(SETTINGS_TESTERS, reducer)]
})
export class TestersModule {}
