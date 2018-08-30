import { Injectable } from '@angular/core';
import { ILink } from './../../../../manage/links/link.interface';
import { TilesUtilsService } from '../tiles.utils.service';

@Injectable()
export class ResourcesUtilsService {
  isListOfLists(link: ILink) {
    return link.link_url === 'oohlala://campus_link_list';
  }

  isResourceSupportedByWebApp(linkUrl: string) {
    return TilesUtilsService.webAppSupportedLinkUrls.includes(linkUrl);
  }
}
