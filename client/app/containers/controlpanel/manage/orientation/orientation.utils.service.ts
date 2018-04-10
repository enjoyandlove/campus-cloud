import { Injectable } from '@angular/core';
import { ProgramMembership } from './orientation.status';

@Injectable()
export class OrientationUtilsService {

  getSubNavChildren(hasMembership: number) {
    let links = [];

    links = [{ label: 'Info', link: 'info'}, ...links];

    if (hasMembership === ProgramMembership.enabled) {
      // links = [{ label: 'Members', link: 'members' }, ...links];
      // links = [{ label: 'Feeds', link: 'feeds' }, ...links];
    }

    links = [{ label: 'To-Dos', link: 'todos' }, ...links];
    links = [{ label: 'Events', link: 'events'}, ...links];

    return links;
  }

  buildHeader(program) {
    const menu = {
      heading: `[NOTRANSLATE]${program.name}[NOTRANSLATE]`,
      crumbs: {
        url: 'orientation',
        label: 'orientation',
      },
      subheading: null,
      em: null,
      children: [],
    };

    const subNav = this.getSubNavChildren(program.has_membership);

    subNav.forEach((nav) => {
      menu.children.push({
        label: nav.label.toLocaleLowerCase(),
        url: `/manage/orientation/${program.id}/${nav.link}`,
      });
    });

    return menu;
  }
}
