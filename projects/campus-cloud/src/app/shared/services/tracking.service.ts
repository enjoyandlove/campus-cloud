import { Injectable } from '@angular/core';
import * as amplitude from 'amplitude-js';
import { Router } from '@angular/router';

import { EnvService } from '@campus-cloud/config/env';

export enum userType {
  new = 'New',
  existing = 'Existing'
}

export const menuNames = {
  0: 'menu_name',
  1: 'sub_menu_name',
  2: 'page_name'
};

declare var window: any;

@Injectable()
export class CPTrackingService {
  constructor(public router: Router, private env: EnvService) {}

  getAmplitudeMenuProperties() {
    const params = [];
    let properties = {};
    let route = this.router.routerState.snapshot.root;
    do {
      if ('amplitude' in route.data && route.data.amplitude !== 'IGNORE') {
        params.push(route.data);
      }
      route = route.firstChild;
    } while (route);

    params.map((p, index) => {
      properties = {
        ...properties,
        [menuNames[index]]: p.amplitude
      };
    });

    return properties;
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
