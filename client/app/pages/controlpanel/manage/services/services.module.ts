import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { ServicesListComponent } from './list';
import { ServicesDeleteComponent } from './delete';

import { ServicesService } from './services.service';
import { ServicesRoutingModule } from './services.routing.module';

import {
  ServicesListActionBoxComponent
} from './list/components';

import {
  ServicesExcelModalComponent
} from './excel/components';


@NgModule({
  declarations: [ ServicesListComponent, ServicesListActionBoxComponent, ServicesDeleteComponent,
  ServicesExcelModalComponent ],

  imports: [ CommonModule, SharedModule, ServicesRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ ServicesService ],
})
export class ServicesModule {}
