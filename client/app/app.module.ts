import { NgModule } from '@angular/core';

import { APP_COMPONENTS, BOOTSTRAP_COMP } from './config/components';
import { APP_MODULES } from './config/modules';
import { APP_PROVIDERS } from './config/providers';

@NgModule({
  imports: [APP_MODULES],
  declarations: [APP_COMPONENTS],
  providers: [APP_PROVIDERS],
  bootstrap: [BOOTSTRAP_COMP],
})
export class AppModule {
  constructor() {}
}
