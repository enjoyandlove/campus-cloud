import { NgModule } from '@angular/core';

import { FeedsModule } from '../../feeds/feeds.module';
import { ServicesFeedsComponent } from './services-feeds.component';

@NgModule({
  declarations: [ServicesFeedsComponent],

  imports: [FeedsModule]
})
export class ServicesFeedsModule {}
