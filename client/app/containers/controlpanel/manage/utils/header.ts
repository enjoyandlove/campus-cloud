import { Injectable } from '@angular/core';

import {
  canSchoolReadResource,
  canAccountLevelReadResource,
} from './../../../../shared/utils/privileges';

import { CPSession } from './../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../shared/constants';

@Injectable()
export class ManageHeaderService {
  privileges;

  constructor(private session: CPSession) {
    this.privileges = require('../manage.header.json');
  }

  filterByPrivileges() {
    let _children;

    _children = this.privileges.children.filter((child) => {
      if (child.privilege === CP_PRIVILEGES_MAP.events) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.events)
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.moderation) {
        return canSchoolReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.moderation,
        )
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.clubs) {
        const schoolLevel = canSchoolReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.clubs,
        );
        const accountLevel = canAccountLevelReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.clubs,
        );

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.services) {
        const schoolLevel = canSchoolReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.services,
        );
        const accountLevel = canAccountLevelReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.services,
        );

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.campus_announcements) {
        return canSchoolReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.campus_announcements,
        )
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.campus_maps) {
        return canSchoolReadResource(
          this.session.g,
          CP_PRIVILEGES_MAP.campus_maps,
        )
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.links) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.links)
          ? child
          : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.calendar) {
        return canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.calendar)
          ? child
          : null;
      }
    });

    return Object.assign({}, this.privileges, { children: _children });
  }
}
