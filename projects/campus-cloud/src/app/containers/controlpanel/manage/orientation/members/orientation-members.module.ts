import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { reducers, effects } from './store';
import { ModalService } from '@shared/services';
import { SharedModule } from '@shared/shared.module';
import { OrientationMembersEditComponent } from './edit';
import { OrientationMembersListComponent } from './list';
import { OrientationMembersDeleteComponent } from './delete';
import { OrientationMembersCreateComponent } from './create';
import { LibsCommmonMembersModule } from '@libs/members/common/common-members.module';
import { OrientationMembersRoutingModule } from './orientation-members.routing.module';
import {
  LibsCommonMembersUtilsService,
  LibsCommonMembersService
} from '@libs/members/common/providers';

@NgModule({
  entryComponents: [
    OrientationMembersEditComponent,
    OrientationMembersDeleteComponent,
    OrientationMembersCreateComponent
  ],
  declarations: [
    OrientationMembersListComponent,
    OrientationMembersEditComponent,
    OrientationMembersDeleteComponent,
    OrientationMembersCreateComponent
  ],
  providers: [ModalService, LibsCommonMembersService, LibsCommonMembersUtilsService],
  imports: [
    CommonModule,
    SharedModule,
    LibsCommmonMembersModule,
    OrientationMembersRoutingModule,
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('orientationMemberState', reducers)
  ]
})
export class OrientationMembersModule {}
