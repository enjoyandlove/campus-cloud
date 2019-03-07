import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { ModalService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { SETTINGS_TESTERS } from '@shared/constants';
import { reducerMap, TestersEffects } from './store';
import { CampusTestersService } from './campus-testers.service';
import { TestersListComponent } from './list/testers-list.component';
import { TestersCreateComponent } from './create/testers-create.component';
import { TestersDeleteComponent } from './delete/testers-delete.component';
import { CampusTestersRoutingModule } from './campus-testers-routing.module';
import { TestUsersComponent } from './list/components/test-users/test-users.component';
import { NoTestersComponent } from './list/components/no-testers/no-testers.component';
import { TestersActionBoxComponent } from './list/components/testers-action-box/testers-action-box.component';

@NgModule({
  entryComponents: [TestersCreateComponent, TestersDeleteComponent],
  declarations: [
    NoTestersComponent,
    TestUsersComponent,
    TestersListComponent,
    TestersCreateComponent,
    TestersDeleteComponent,
    TestersActionBoxComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    CampusTestersRoutingModule,
    EffectsModule.forFeature([TestersEffects]),
    StoreModule.forFeature(SETTINGS_TESTERS, reducerMap)
  ],
  providers: [CampusTestersService, ModalService]
})
export class CampusTestersModule {}
