import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BannerListComponent } from './list';
import { BannerService } from './banner.service';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { BannerRoutingModule } from './banner.routing.module';

import {
  BannerUploadComponent,
  BrandingFormComponent,
  BannerUploadButtonComponent,
  BannerControlButtonsComponent
} from './list/components';

@NgModule({
  declarations: [
    BannerListComponent,
    BannerUploadComponent,
    BrandingFormComponent,
    BannerUploadButtonComponent,
    BannerControlButtonsComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    LayoutsModule,
    RouterModule,
    ReactiveFormsModule,
    BannerRoutingModule
  ],

  providers: [BannerService]
})
export class BannerModule {}
