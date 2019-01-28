import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { BannerListComponent } from './list';
import { BannerService } from './banner.service';
import { SharedModule } from '@shared/shared.module';
import { LayoutsModule } from '@app/layouts/layouts.module';

import { BannerUploadButtonComponent, BannerControlButtonsComponent } from './list/components';

import { BannerRoutingModule } from './banner.routing.module';

@NgModule({
  declarations: [BannerListComponent, BannerUploadButtonComponent, BannerControlButtonsComponent],

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
