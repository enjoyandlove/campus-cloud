/* tslint:disable: max-line-length */
import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';
import { PRIMARY_OUTLET, Router } from '@angular/router';

import { CPAmplitudeService } from './amplitude.service';
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
  constructor(public router: Router, public cpAmplitude: CPAmplitudeService) {}

  loadAmplitude(session = null) {
    const user = session ? session.g.get('user') : null;
    const school = session ? session.g.get('school') : null;
    const isInternal = session ? session.isInternal : null;
    const api_key = isProd
      ? '6c5441a7008b413b8d3d29f8130afae1'
      : 'be78bb81dd7f98c7cf8d1a7994e07c85';

    require('node_modules/amplitude-js/src/amplitude-snippet.js');

    window.amplitude.getInstance().init(api_key, this.getSchoolUserID(user));

    this.setIdentity(school, user, isInternal);
  }

  setIdentity(school, user, is_oohlala) {
    if (school && user) {
      const accountLevelPrivileges = user.account_level_privileges;
      const schoolLevelPrivileges = user.school_level_privileges[school.id];

      const userPermissions = this.cpAmplitude.getUserPermissionsEventProperties(
        schoolLevelPrivileges,
        accountLevelPrivileges
      );

      const userProperties = {
        is_oohlala,
        school_name: school.name,
        jobs: userPermissions.jobs_permission,
        links: userPermissions.links_permission,
        deals: userPermissions.deals_permission,
        school_id: this.getSchoolUserID(school),
        walls: userPermissions.walls_permission,
        events: userPermissions.event_permission,
        notify: userPermissions.notify_permission,
        assess: userPermissions.assess_permission,
        studio: userPermissions.studio_permission,
        calendar: userPermissions.calendar_permission,
        audiences: userPermissions.audience_permission,
        team_member: userPermissions.invite_permission,
        locations: userPermissions.locations_permission,
        club_executive: userPermissions.club_permission,
        orientation: userPermissions.orientation_permission,
        service_executive: userPermissions.service_permission,
        athletics_executive: userPermissions.athletic_permission
      };

      window.amplitude.getInstance().setUserProperties(userProperties);
    }
  }

  getSchoolUserID(user) {
    if (!user) {
      return;
    }

    if (isCanada) {
      return `CAN${user.id}`;
    } else if (isSea) {
      return `SEA${user.id}`;
    } else if (isUsa) {
      return `US${user.id}`;
    } else {
      // default for dev
      return `US${user.id}`;
    }
  }

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
    if (!isProd && !isStaging) {
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
