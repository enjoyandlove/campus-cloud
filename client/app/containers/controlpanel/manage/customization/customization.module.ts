import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { CustomizationListComponent }  from './list';

import {
  CustomizationUploadButtonComponent,
  CustomizationControlButtonsComponent
} from './list/components';

import { CustomizationRoutingModule } from './customization.routing.module';

// import { LinksService } from './links.service';

@NgModule({
  declarations: [ CustomizationListComponent, CustomizationUploadButtonComponent,
  CustomizationControlButtonsComponent ],

  imports: [ CommonModule, SharedModule, RouterModule, ReactiveFormsModule,
  CustomizationRoutingModule ],

  providers: [ ],
})
export class CustomizationModule {}
