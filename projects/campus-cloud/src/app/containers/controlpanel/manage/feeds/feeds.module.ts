import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';

import { FeedsListComponent } from './list';
import * as fromWalls from './store/reducers';
import { FeedsService } from './feeds.service';
import { CPI18nPipe } from '@campus-cloud/shared/pipes';
import { FeedsUtilsService } from './feeds.utils.service';
import { UserService } from '@campus-cloud/shared/services';
import { FeedsRoutingModule } from './feeds.routing.module';
import { FeedsComponent } from './list/base/feeds.component';
import { SharedModule } from '../../../../shared/shared.module';
import { FeedsAmplitudeService } from './feeds.amplitude.service';
import { LayoutsModule } from '@campus-cloud/layouts/layouts.module';
import { FeedsInfoComponent } from '@controlpanel/manage/feeds/info';
import { ImageModule } from '@campus-cloud/shared/services/image/image.module';

import {
  FeedBodyComponent,
  FeedItemComponent,
  FeedMoveComponent,
  FeedTagsComponent,
  FeedEditComponent,
  FeedHeaderComponent,
  FeedSearchComponent,
  FeedCommentComponent,
  FeedCommentsComponent,
  FeedSettingsComponent,
  FeedDropdownComponent,
  FeedInputBoxComponent,
  FeedDeleteModalComponent,
  FeedInteractionsComponent,
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
    FeedTagsComponent,
    FeedsListComponent,
    FeedEditComponent,
    FeedsInfoComponent,
    FeedHeaderComponent,
    FeedSearchComponent,
    FeedCommentComponent,
    FeedDropdownComponent,
    FeedInputBoxComponent,
    FeedSettingsComponent,
    FeedCommentsComponent,
    FeedDeleteModalComponent,
    FeedApproveModalComponent,
    FeedInteractionsComponent,
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
    ImageModule.forRoot(),
    StoreModule.forFeature('WALLS_STATE', {
      feeds: fromWalls.feedsReducer,
      bannedEmails: fromWalls.bannedEmailsReducer
    })
  ],

  providers: [FeedsService, FeedsUtilsService, CPI18nPipe, UserService, FeedsAmplitudeService],

  exports: [
    FeedsComponent,
    FeedMoveComponent,
    FeedItemComponent,
    FeedBodyComponent,
    FeedEditComponent,
    FeedTagsComponent,
    FeedsListComponent,
    FeedHeaderComponent,
    FeedSearchComponent,
    FeedCommentComponent,
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
