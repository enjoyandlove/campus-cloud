import { Injectable } from '@angular/core';

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

    _children = this.privileges.children.filter(child => {
      if (child.privilege === CP_PRIVILEGES_MAP.events) {

        return this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.events) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.moderation) {

        return this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.moderation) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.clubs) {
        const schoolLevel = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.clubs);
        const accountLevel = this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.clubs);

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.services) {
        const schoolLevel = this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.services);
        const accountLevel = this.session.canAccountLevelReadResource(CP_PRIVILEGES_MAP.services);

        return schoolLevel || accountLevel ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.campus_announcements) {

        return this.
          session.canSchoolReadResource(CP_PRIVILEGES_MAP.campus_announcements) ? child : null;
      } else if (child.privilege === CP_PRIVILEGES_MAP.links) {

        return this.session.canSchoolReadResource(CP_PRIVILEGES_MAP.links) ? child : null;
      }
    });

    return Object.assign({}, this.privileges, { children: _children });
  }
}

