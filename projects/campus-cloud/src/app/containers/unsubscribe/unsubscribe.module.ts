import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ApiService } from '@campus-cloud/base';
import { UnsubscribeComponent } from './unsubscribe.component';
import { SharedModule } from '@campus-cloud/shared/shared.module';
import { UnsubscribeRoutingModule } from './unsubscribe.routing.module';
import { UnsubscribeGenericComponent } from '@campus-cloud/containers/unsubscribe/generic';

@NgModule({
  declarations: [UnsubscribeComponent, UnsubscribeGenericComponent],

  imports: [CommonModule, SharedModule, RouterModule, UnsubscribeRoutingModule],

  providers: [ApiService]
})
export class UnsubscribeModule {}
