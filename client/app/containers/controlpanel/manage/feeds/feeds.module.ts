import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FeedsListComponent } from './list';
import { FeedsService } from './feeds.service';
import { FeedsUtilsService } from './feeds.utils.service';
import { FeedsRoutingModule } from './feeds.routing.module';
import { FeedsComponent } from './list/base/feeds.component';
import { SharedModule } from '../../../../shared/shared.module';
import { LazyLoadImagesModule } from 'ngx-lazy-load-images';

import {
  FeedApproveCommentModalComponent,
  FeedApproveModalComponent,
  FeedBodyComponent,
  FeedCommentComponent,
  FeedCommentsComponent,
  FeedDeleteCommentModalComponent,
  FeedDeleteModalComponent,
  FeedDropdownComponent,
  FeedFiltersComponent,
  FeedHeaderComponent,
  FeedInputBoxComponent,
  FeedItemComponent,
  FeedMoveComponent,
  FeedSettingsComponent
} from './list/components';

@NgModule({
  declarations: [
    FeedsListComponent,
    FeedMoveComponent,
    FeedItemComponent,
    FeedCommentComponent,
    FeedInputBoxComponent,
    FeedSettingsComponent,
    FeedFiltersComponent,
    FeedCommentsComponent,
    FeedHeaderComponent,
    FeedBodyComponent,
    FeedDropdownComponent,
    FeedDeleteModalComponent,
    FeedApproveModalComponent,
    FeedDeleteCommentModalComponent,
    FeedApproveCommentModalComponent,
    FeedsComponent
  ],

  imports: [
    CommonModule,
    SharedModule,
    FeedsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    LazyLoadImagesModule
  ],

  providers: [FeedsService, FeedsUtilsService],

  exports: [
    FeedsListComponent,
    FeedMoveComponent,
    FeedItemComponent,
    FeedCommentComponent,
    FeedInputBoxComponent,
    FeedSettingsComponent,
    FeedFiltersComponent,
    FeedCommentsComponent,
    FeedHeaderComponent,
    FeedBodyComponent,
    FeedDropdownComponent,
    FeedDeleteModalComponent,
    FeedApproveModalComponent,
    FeedDeleteCommentModalComponent,
    FeedApproveCommentModalComponent,
    FeedsComponent
  ]
})
export class FeedsModule {}
