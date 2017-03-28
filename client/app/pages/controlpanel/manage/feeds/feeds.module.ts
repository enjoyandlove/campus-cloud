import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import {
  FeedBodyComponent,
  FeedMoveComponent,
  FeedItemComponent,
  FeeHeaderComponent,
  FeedCommentComponent,
  FeedFiltersComponent,
  FeedCommentsComponent,
  FeedDropdownComponent,
  FeedInputBoxComponent,
  FeedSettingsComponent,
  FeedDeleteModalComponent,
  FeedApproveModalComponent
} from './list/components';

import { FeedsListComponent } from './list';
import { FeedsService } from './feeds.service';
import { FeedsRoutingModule } from './feeds.routing.module';

@NgModule({
  declarations: [ FeedsListComponent, FeedMoveComponent, FeedItemComponent, FeedCommentComponent,
  FeedInputBoxComponent, FeedSettingsComponent, FeedFiltersComponent, FeedCommentsComponent,
  FeeHeaderComponent, FeedBodyComponent, FeedDropdownComponent, FeedDeleteModalComponent,
  FeedApproveModalComponent ],

  imports: [ CommonModule, SharedModule, FeedsRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ FeedsService ],
})
export class FeedsModule {}
