import { Injectable } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { ProgramMembership } from './orientation.status';
import { CP_PRIVILEGES_MAP } from '@campus-cloud/shared/constants';
import { canSchoolReadResource } from '@campus-cloud/shared/utils';

@Injectable()
export class OrientationUtilsService {
  constructor(private session: CPSession) {}
  getSubNavChildren(hasMembership: number) {
    let links = [];

    links = [{ label: 'Info', link: 'info' }, ...links];
    const hasModerationAccess = canSchoolReadResource(this.session.g, CP_PRIVILEGES_MAP.moderation);

    if (hasMembership === ProgramMembership.enabled && hasModerationAccess) {
      links = [{ label: 'Members', link: 'members' }, ...links];
      links = [{ label: 'Feeds', link: 'feeds' }, ...links];
    }

    links = [{ label: 'To-Dos', link: 'todos' }, ...links];
    links = [{ label: 'Events', link: 'events' }, ...links];

    return links;
  }

  buildHeader(program) {
    const menu = {
      heading: `[NOTRANSLATE]${program.name}[NOTRANSLATE]`,
      crumbs: {
        url: 'orientation',
        label: 'orientation'
      },
      subheading: null,
      em: null,
      children: []
    };

    const subNav = this.getSubNavChildren(program.has_membership);

    subNav.forEach((nav) => {
      menu.children.push({
        isSubMenuItem: true,
        amplitude: nav.label,
        label: nav.label.toLocaleLowerCase(),
        url: `/manage/orientation/${program.id}/${nav.link}`
      });
    });

    return menu;
  }
}
