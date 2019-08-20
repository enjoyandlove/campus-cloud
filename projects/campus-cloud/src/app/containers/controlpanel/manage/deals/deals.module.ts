import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { DealsService } from './deals.service';
import { DealsRoutingModule } from './deals.routing.module';
import { StoreModule } from './stores/store.module';
import { SharedModule } from '../../../../shared/shared.module';

import { DealsListComponent } from './list';
import { DealsEditComponent } from './edit';
import { DealsInfoComponent } from './info';
import { DealsDeleteComponent } from './delete';
import { DealsCreateComponent } from './create';
import { DealsListActionBoxComponent } from './list/components/action-box';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';

import {
  DealsCardComponent,
  DealsFormComponent,
  StoreCardComponent,
  StoreSelectorComponent
} from './components';

@NgModule({
  declarations: [
    DealsCardComponent,
    DealsFormComponent,
    StoreCardComponent,
    DealsListComponent,
    DealsEditComponent,
    DealsInfoComponent,
    DealsDeleteComponent,
    DealsCreateComponent,
    StoreSelectorComponent,
    DealsListActionBoxComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    ImageModule.forRoot(),
    DealsRoutingModule,
    ReactiveFormsModule,
    StoreModule
  ],
  providers: [DealsService]
})
export class DealsModule {}
