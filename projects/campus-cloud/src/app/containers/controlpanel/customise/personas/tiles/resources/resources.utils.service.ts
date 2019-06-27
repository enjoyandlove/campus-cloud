import { Injectable } from '@angular/core';

import { IPersona } from '../../persona.interface';
import { PersonasType } from '../../personas.status';
import { TilesUtilsService } from '../tiles.utils.service';
import { ILink } from './../../../../manage/links/link.interface';

@Injectable()
export class ResourcesUtilsService {
  types: any[];

  constructor() {
    this.types = require('./resources.json');
  }

  isListOfLists(link: ILink) {
    return link.link_url === 'oohlala://campus_link_list';
  }

  isResourceSupportedByWebApp(linkUrl: string) {
    return TilesUtilsService.webAppSupportedLinkUrls.includes(linkUrl);
  }

  getType(persona: IPersona, resource: ILink) {
    const matchType = this.types.find((type) => type.meta.link_url === resource.link_url);

    const isMobile = persona.platform === PersonasType.mobile;
    const isWebSupported = this.isResourceSupportedByWebApp(resource.link_url);
    const isUnsupported =
      TilesUtilsService.deprecatedTiles.includes(resource.link_url) || this.isListOfLists(resource);
    const webOrExternal = resource.open_in_browser ? 'external_link' : 'web_link';

    if (matchType) {
      return isMobile ? matchType.id : isWebSupported ? matchType.id : null;
    } else if (isUnsupported) {
      return null;
    } else {
      return this.types.find((type) => {
        return type.id === webOrExternal;
      }).id;
    }
  }
}
