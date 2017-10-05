import { isProd } from './../../config/env/index';
import { Injectable } from '@angular/core';

declare var window: any;

@Injectable()
export class CPTrackingService {

  static loadAmplitude(userId) {
    (function (w, document) {
      let amplitude = w.amplitude || { '_q': [], '_iq': {} };
      let as = document.createElement('script');
      as.type = 'text/javascript';
      as.async = true;
      as.src = 'https://d24n15hnbwhuhn.cloudfront.net/libs/amplitude-3.7.0-min.gz.js';
      as.onload = function () {
        if (w.amplitude.runQueuedFunctions) {
          w.amplitude.runQueuedFunctions();
        } else {
          console.log('[Amplitude] Error: could not load SDK');
        } };
      let s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(as, s);
      function proxy(obj, fn) {
        obj.prototype[fn] = function () {
          this._q.push([fn].concat(Array.prototype.slice.call(arguments, 0))); return this;
        };
      }
      let Identify = function () { this._q = []; return this; };
      let identifyFuncs = ['add', 'append', 'clearAll', 'prepend', 'set', 'setOnce', 'unset'];
      for (let i = 0; i < identifyFuncs.length; i++) { proxy(Identify, identifyFuncs[i]); }
      amplitude.Identify = Identify;
      let Revenue = function () { this._q = []; return this; };
      const revenueFuncs = [
        'setProductId',
        'setQuantity',
        'setPrice',
        'setRevenueType',
        'setEventProperties'
      ];

      for (let j = 0; j < revenueFuncs.length; j++) { proxy(Revenue, revenueFuncs[j]); }

      amplitude.Revenue = Revenue;

      let funcs = ['init', 'logEvent', 'logRevenue', 'setUserId', 'setUserProperties',
        'setOptOut', 'setVersionName', 'setDomain', 'setDeviceId',
        'setGlobalUserProperties', 'identify', 'clearUserProperties',
        'setGroup', 'logRevenueV2', 'regenerateDeviceId',
        'logEventWithTimestamp', 'logEventWithGroups', 'setSessionId'];

      function setUpProxy(instance) {
        function proxyMain(fn) {
          instance[fn] = function () {
            instance._q.push([fn].concat(Array.prototype.slice.call(arguments, 0)));
          };
        }
        for (let k = 0; k < funcs.length; k++) { proxyMain(funcs[k]); }
      }

      setUpProxy(amplitude);

      amplitude.getInstance = function (instance) {
        instance = ((!instance || instance.length === 0)
          ? '$default_instance' : instance).toLowerCase();
        if (!amplitude._iq.hasOwnProperty(instance)) {
          amplitude._iq[instance] = { '_q': [] }; setUpProxy(amplitude._iq[instance]);
        }
        return amplitude._iq[instance];
      };

      w.amplitude = amplitude;

    })(window, document);

    window
      .amplitude
      .getInstance()
      .init('6c5441a7008b413b8d3d29f8130afae1', userId);
  }

  hotJarRecordPage() {
    if (!isProd) { return; }

    (function (h, o, t, j) {
      h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = { hjid: 514110, hjsv: 5 };
      let a = o.getElementsByTagName('head')[0];
      let r: any = o.createElement('script'); r.async = 1;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');

  }

  amplitudeEmitEvent(eventType: string, extraData?: {}) {
    window.amplitude.getInstance().logEvent(eventType, extraData);
  }

  gaTrackPage(pageName) {
    if (!isProd) { return; }

    ga('set', 'page', pageName);
    ga('send', 'pageview');
  }

  gaEmitEvent(eventCategory: string,
    eventAction: string,
    eventLabel: string = null,
    eventValue: number = null) {

    if (!isProd) { return; }

    ga('send', 'event', {
      eventCategory: eventCategory,
      eventLabel: eventLabel,
      eventAction: eventAction,
      eventValue: eventValue
    });
  }
}
