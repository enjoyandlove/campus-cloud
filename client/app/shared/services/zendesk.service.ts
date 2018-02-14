import { Injectable } from '@angular/core';

import { isProd } from './../../config/env';

// declare var window;

@Injectable()
export class ZendeskService {
  setSuggestion(_) {
    if (isProd) {
      // if (window.zE !== undefined) {
      //   window.zE.setHelpCenterSuggestions({ search });
      // }
    }
  }

  getZendeskQueryFromUrl(url: string) {
    return url
      .split('/')
      .filter((route) => !Number.isInteger(+route))
      .join(' ');
  }
}
