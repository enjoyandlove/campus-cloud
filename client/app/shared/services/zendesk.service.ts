import { Injectable } from '@angular/core';

import { isProd } from './../../config/env';

declare var window;

@Injectable()
export class ZendeskService {
  setSuggestion(search: string) {
    if (isProd) {
      window.zE.setHelpCenterSuggestions({ search });
    }
  }

  getZendeskQueryFromUrl(url: string) {
    return url
      .split('/')
      .filter((route) => !Number.isInteger(+route))
      .join(' ');
  }
}
