import { Injectable } from '@angular/core';
import { ILink } from './../../../../manage/links/link.interface';

@Injectable()
export class ResourcesUtilsService {
  isListOfLists(link: ILink) {
    return link.link_url === 'oohlala://campus_link_list';
  }
}
