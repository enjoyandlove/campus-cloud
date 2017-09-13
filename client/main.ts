// import { TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID  } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { isProd } from './app/config/env/index';

import { AppModule } from './app/app.module';

// import { TRANSLATION_FR, TRANSLATION_EN } from '../locale';

// depending on the env mode, enable prod mode or add debugging modules
if (isProd) {
  enableProdMode();
}

export function main() {
  // need to implement logic to switch languages
  return platformBrowserDynamic().bootstrapModule(AppModule);
  // return platformBrowserDynamic().bootstrapModule(AppModule, {
  //   providers: [
  //     {provide: TRANSLATIONS, useValue: true ? TRANSLATION_EN : TRANSLATION_FR},
  //     {provide: TRANSLATIONS_FORMAT, useValue: 'xlf'},
  //     {provide: LOCALE_ID, useValue: 'en'}
  //     ]
  // });
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
