import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';

import { FeedsRoutingModule } from './feeds.routing.module';
import { FeedsService } from './feeds.service';
import { FeedsListComponent } from './list';
import { FeedsComponent } from './list/base/feeds.component';

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
  FeedSettingsComponent,
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
    FeedsComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    FeedsRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  ],

  providers: [FeedsService],

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
    FeedsComponent,
  ],
})
export class FeedsModule {}
