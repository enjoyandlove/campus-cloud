import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
import { UnsubscribeComponent } from './unsubscribe.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { UnsubscribeRoutingModule } from './unsubscribe.routing.module';
import { UnsubscribeFeedsComponent } from '@campus-cloud/containers/unsubscribe';

@NgModule({
  declarations: [UnsubscribeComponent, UnsubscribeFeedsComponent],

  imports: [CommonModule, SharedModule, RouterModule, UnsubscribeRoutingModule],

  providers: [ApiService]
})
export class UnsubscribeModule {}
