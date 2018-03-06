import { Injectable } from '@angular/core';

@Injectable()
export class OrientationUtilsService {

  getSubNavChildren(isMembership: number) {
    let links = [];

    links = [{ label: 'Info', link: 'info'}, ...links];

    if (isMembership === 1) {
      links = [{ label: 'Members', link: 'members' }, ...links];
      links = [{ label: 'Feeds', link: 'feeds' }, ...links];
    }

    links = [{ label: 'To-Dos', link: 'todos' }, ...links];
    links = [{ label: 'Events', link: 'events'}, ...links];

    return links;
  }
}
