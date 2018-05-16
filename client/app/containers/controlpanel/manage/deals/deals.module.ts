import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DealsService } from './deals.service';
import { DealsRoutingModule } from './deals.routing.module';
import { StoreModule } from './stores/store.module';
import { SharedModule } from '../../../../shared/shared.module';

import { DealsListComponent } from './list';
import { DealsListActionBoxComponent } from './list/components/action-box';

@NgModule({
  declarations: [
    DealsListComponent,
    DealsListActionBoxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    DealsRoutingModule,
    ReactiveFormsModule,
    StoreModule
  ],
  providers: [DealsService]
})
export class DealsModule {}
