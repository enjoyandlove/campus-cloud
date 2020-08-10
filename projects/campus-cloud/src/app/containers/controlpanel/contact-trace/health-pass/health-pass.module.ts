import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ModalService, AdminService } from '@campus-cloud/shared/services';

import { SharedModule } from '@campus-cloud/shared/shared.module';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';

import { HealthPassComponent } from './health-pass.component';
import { HealthPassRoutingModule } from './health-pass.routing.module';
@NgModule({
  declarations: [HealthPassComponent],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    ReactiveFormsModule,
    HealthPassRoutingModule,
    FormsModule
  ],

  providers: [CPI18nPipe, AdminService, ModalService]
})
export class HealthPassModule {}
