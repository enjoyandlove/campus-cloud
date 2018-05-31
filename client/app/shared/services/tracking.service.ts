import { Injectable } from '@angular/core';
import { PRIMARY_OUTLET, Router } from '@angular/router';

import { isCanada, isProd, isSea, isUsa, isStaging } from './../../config/env/index';

/**
 * i.e url = /manage/events/123/info
 * Route Level first = parent(manage), second = child(events),
 * third = sub-child and so on
 * @type {{first: number; second: number}}
 */
export enum RouteLevel {
  'first' = 0,
  'second' = 1,
  'third' = 2
}

declare var window: any;

@Injectable()
export class CPTrackingService {
  constructor(public router: Router) {}

  loadAmplitude(session) {
    let identify;
    const user = session.get('user');
    const school = session.get('school');
    require('node_modules/amplitude-js/src/amplitude-snippet.js');

    window.amplitude
      .getInstance()
      .init('be78bb81dd7f98c7cf8d1a7994e07c85', this.getSchoolUserID(user.id));

    identify = new window.amplitude.Identify()
      .set('school_name', school.name)
      .set('is_oohlala', this.isOohlala(user.email))
      .set('school_id', this.getSchoolUserID(school.id));

    window.amplitude.getInstance().identify(identify);
  }

  isOohlala(email) {
    return email.split('@').includes('oohlalamobile.com');
  }

  getSchoolUserID(id) {
    if (isCanada) {
      return `CAN${id}`;
    } else if (isSea) {
      return `SEA${id}`;
    } else if (isUsa) {
      return `US${id}`;
    } else {
      // default for dev
      return `US${id}`;
    }
  }

  getEventProperties() {
    return {
      menu_name: this.activatedRoute(this.router, RouteLevel.first),
      sub_menu_name: this.activatedRoute(this.router, RouteLevel.second),
    };
  }

  activatedRoute(router, level) {
    const tree = router.parseUrl(router.url);
    const children = tree.root.children[PRIMARY_OUTLET];
    const segments = children.segments;

    return segments[level] ? this.capitalizeFirstLetter(segments[level].path) : null;
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  hotJarRecordPage() {
    if (!isProd) {
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
    if (!isStaging) {
      return;
    }

    window.amplitude.getInstance().logEvent(eventName, eventProperties);
  }

  gaTrackPage(pageName) {
    if (!isProd) {
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
    if (!isProd) {
      return;
    }

    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
