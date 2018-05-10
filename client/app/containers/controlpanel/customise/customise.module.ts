import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { CustomiseComponent } from './customise.component';

import { CustomiseRoutingModule } from './customise.routing.module';

@NgModule({
  declarations: [CustomiseComponent],

  imports: [CommonModule, SharedModule, CustomiseRoutingModule],

  providers: []
})
export class CustomiseModule {}
