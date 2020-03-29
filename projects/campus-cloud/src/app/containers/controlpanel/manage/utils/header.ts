import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromStore from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session/index';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import {
  canSchoolReadResource,
  canAccountLevelReadResource
} from '@campus-cloud/shared/utils/privileges';

@Injectable()
export class ManageHeaderService {
  privileges;

  constructor(private session: CPSession, private store: Store<fromStore.IHeader>) {
    this.privileges = require('../manage.header.json');
  }

  updateHeader() {
    Promise.resolve().then(() => {
      this.store.dispatch({
        type: fromStore.baseActions.HEADER_UPDATE,
        payload: this.filterByPrivileges()
      });
    });
  }

  filterByPrivileges() {
    let _children;

    _children = this.privileges.children.filter((child) => {
      if (child.privilege === CP_PRIVILEGES_MAP.events) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.moderation) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation) &&
          this.session.g.get('schoolConfig').campus_wall_enabled
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.clubs) {
        const schoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);
        const accountLevel = canAccountLevelReadResource(this.session.g, CP_PRIVILEGES_MAP.clubs);

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.athletics) {
        const schoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.athletics);
        const accountLevel = canAccountLevelReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.athletics
        );

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.services) {
        const schoolLevel = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.services);
        const accountLevel = canAccountLevelReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.services
        );

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.campus_announcements) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_announcements)
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.campus_maps) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.campus_maps) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.links) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.links) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.calendar) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.calendar) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.app_customization) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.app_customization)
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.orientation) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.orientation) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.jobs) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.jobs) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.deals) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.deals) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.dining) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.dining) ? child : null;
      }
    });

    return Object.assign({}, this.privileges, { children: _children });
  }
}
