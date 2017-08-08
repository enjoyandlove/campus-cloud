import { Injectable } from '@angular/core';

import { CPSession } from './../../../../session/index';
import { CP_PRIVILEGES_MAP } from './../../../../shared/utils/privileges';

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
          return this.session.privileges.readEvent ? child : null;
        } else if (child.privilege === CP_PRIVILEGES_MAP.moderation) {
          return this.session.privileges.readFeed ? child : null;
        } else if (child.privilege === CP_PRIVILEGES_MAP.clubs) {
          return this.session.privileges.readClub ? child : null;
        } else if (child.privilege === CP_PRIVILEGES_MAP.services) {
          return this.session.privileges.readService ? child : null;
        } else if (child.privilege === CP_PRIVILEGES_MAP.campus_announcements) {
          return this.session.privileges.readNotify ? child : null;
        } else if (child.privilege === CP_PRIVILEGES_MAP.links) {
          return this.session.privileges.readLink ? child : null;
        }
      });

      return Object.assign({}, this.privileges, { children: _children });
    }
  }

