import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { StoreListComponent } from './list';
import { StoreEditComponent } from './edit';
import { StoreDeleteComponent } from './delete';
import { StoreCreateComponent } from './create';
import { StoreFormComponent } from './components/store-form';
import { StoreActionBoxComponent } from './list/components/action-box';

import { StoreService } from './store.service';
import { StoreRoutingModule } from './store.routing.module';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  declarations: [
    StoreFormComponent,
    StoreListComponent,
    StoreEditComponent,
    StoreDeleteComponent,
    StoreCreateComponent,
    StoreActionBoxComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    StoreRoutingModule
  ],
  exports: [StoreFormComponent],
  providers: [StoreService]
})
export class StoreModule {}
