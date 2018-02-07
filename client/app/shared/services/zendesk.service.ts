import { Injectable } from '@angular/core';

declare var window;

@Injectable()
export class ZendeskService {
  setSuggestion(search: string) {
    console.log('setSuggestion', search);

    window.zE.setHelpCenterSuggestions({ search });
  }

  getZendeskQueryFromUrl(url: string) {
    return url
      .split('/')
      .filter((route) => !Number.isInteger(+route))
      .join(' ');
  }
}
