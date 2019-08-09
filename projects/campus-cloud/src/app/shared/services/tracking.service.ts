import { PRIMARY_OUTLET, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as amplitude from 'amplitude-js';

import { get as _get } from 'lodash';
import { EnvService } from '@campus-cloud/config/env';

/**
 * i.e url = /manage/events/123/info
 * Route Level first = parent(manage), second = child(events),
 * third = sub-child and so on
 * {{first: number; second: number}}
 */
export enum RouteLevel {
  'first' = 0,
  'second' = 1,
  'third' = 2,
  'fourth' = 3
}

export enum userType {
  new = 'New',
  existing = 'Existing'
}

declare var window: any;

@Injectable()
export class CPTrackingService {
  constructor(public router: Router, private env: EnvService) {}

  getEventProperties() {
    return {
      menu_name: this.activatedRoute(RouteLevel.first),
      sub_menu_name: this.activatedRoute(RouteLevel.second)
    };
  }

  activatedRoute(level) {
    const tree = this.router.parseUrl(this.router.url);
    const children = tree.root.children[PRIMARY_OUTLET];
    const path = _get(children, ['segments', level, 'path'], null);

    return path ? this.capitalizeFirstLetter(path) : null;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  hotJarRecordPage() {
    if (this.env.name !== 'production') {
      return;
    }

    (function(h, o, t, j) {
      h.hj =
        h.hj ||
        function() {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: 514110, hjsv: 5 };
      const a = o.getElementsByTagName('head')[0];
      const r: any = o.createElement('script');
      r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
  }

  amplitudeEmitEvent(eventName: string, eventProperties?: {}) {
    if (this.env.name === 'development') {
      return;
    }

    if (!this._isAmplitudeAvailable()) {
      return;
    }

    amplitude.getInstance().logEvent(eventName, eventProperties);
  }

  gaTrackPage(pageName) {
    if (this.env.name === 'development') {
      return;
    }

    ga('set', 'page', pageName);
    ga('send', 'pageview');
  }

  gaEmitEvent(
    eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null
  ) {
    if (this.env.name !== 'production') {
      return;
    }

    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }

  _isAmplitudeAvailable() {
    return !!amplitude;
  }
}
