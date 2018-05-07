import { Injectable } from '@angular/core';

import { isProd } from './../../config/env/index';

declare var window: any;

@Injectable()
export class CPTrackingService {
  static loadAmplitude(userId) {
    require('node_modules/amplitude-js/src/amplitude-snippet.js');

    window.amplitude.getInstance().init('6c5441a7008b413b8d3d29f8130afae1', userId);
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

  amplitudeEmitEvent(eventType: string, extraData?: {}) {
    if (!isProd) {
      return;
    }

    window.amplitude.getInstance().logEvent(eventType, extraData);
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
