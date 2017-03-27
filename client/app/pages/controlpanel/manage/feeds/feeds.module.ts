import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';

import { FeedsListComponent } from './list';

import {
  MoveFeedComponent,
  FeedItemComponent,
  FeedCommentComponent,
  FeedInputBoxComponent,
  FeedSettingsComponent
} from './list/components';


import { FeedsService } from './feeds.service';
import { FeedsRoutingModule } from './feeds.routing.module';



@NgModule({
  declarations: [ FeedsListComponent, MoveFeedComponent, FeedItemComponent, FeedCommentComponent,
  FeedInputBoxComponent, FeedSettingsComponent ],

  imports: [ CommonModule, SharedModule, FeedsRoutingModule, RouterModule, ReactiveFormsModule ],

  providers: [ FeedsService ],
})
export class FeedsModule {}
