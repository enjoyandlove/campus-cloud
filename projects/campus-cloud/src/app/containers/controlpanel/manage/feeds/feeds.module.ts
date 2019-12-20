import { LazyLoadImagesModule } from 'ngx-lazy-load-images';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { FeedsListComponent } from './list';
import { FeedsService } from './feeds.service';
import { FeedsUtilsService } from './feeds.utils.service';
import { FeedsRoutingModule } from './feeds.routing.module';
import { FeedsComponent } from './list/base/feeds.component';
import { SharedModule } from '../../../../shared/shared.module';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';

import {
  FeedBodyComponent,
  FeedItemComponent,
  FeedMoveComponent,
  FeedHeaderComponent,
  FeedSearchComponent,
  FeedCommentComponent,
  FeedFiltersComponent,
  FeedCommentsComponent,
  FeedSettingsComponent,
  FeedDropdownComponent,
  FeedInputBoxComponent,
  FeedDeleteModalComponent,
  FeedApproveModalComponent,
  FeedDeleteCommentModalComponent,
  FeedApproveCommentModalComponent
} from './list/components';

@NgModule({
  declarations: [
    FeedsComponent,
    FeedMoveComponent,
    FeedItemComponent,
    FeedBodyComponent,
    FeedsListComponent,
    FeedHeaderComponent,
    FeedSearchComponent,
    FeedCommentComponent,
    FeedFiltersComponent,
    FeedDropdownComponent,
    FeedInputBoxComponent,
    FeedSettingsComponent,
    FeedCommentsComponent,
    FeedDeleteModalComponent,
    FeedApproveModalComponent,
    FeedDeleteCommentModalComponent,
    FeedApproveCommentModalComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LayoutsModule,
    FeedsRoutingModule,
    ReactiveFormsModule,
    LazyLoadImagesModule,
    ImageModule.forRoot()
  ],

  providers: [FeedsService, FeedsUtilsService],

  exports: [
    FeedsComponent,
    FeedMoveComponent,
    FeedItemComponent,
    FeedsListComponent,
    FeedBodyComponent,
    FeedHeaderComponent,
    FeedSearchComponent,
    FeedCommentComponent,
    FeedFiltersComponent,
    FeedDropdownComponent,
    FeedInputBoxComponent,
    FeedSettingsComponent,
    FeedCommentsComponent,
    FeedDeleteModalComponent,
    FeedApproveModalComponent,
    FeedDeleteCommentModalComponent,
    FeedApproveCommentModalComponent
  ]
})
export class FeedsModule {}
