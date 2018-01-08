import { NgModule, ApplicationRef } from '@angular/core';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

import { APP_MODULES } from './config/modules';
import { APP_PROVIDERS } from './config/providers';
import { APP_COMPONENTS, BOOTSTRAP_COMP } from './config/components';

@NgModule({
  imports: [ APP_MODULES, ],
  declarations: [ APP_COMPONENTS ],
  providers: [ APP_PROVIDERS ],
  bootstrap: [ BOOTSTRAP_COMP ]
})

export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    const cmpLocation = this.appRef
      .components.map(cmp => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
