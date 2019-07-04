import { Injectable } from '@angular/core';

import { TilesUtilsService } from './tiles/tiles.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPI18nService, CPLogger } from '@campus-cloud/shared/services';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';

const contentTypeLabels = {
  webLink: amplitudeEvents.WEB_LINK,
  resource: amplitudeEvents.RESOURCE,
  singleItem: amplitudeEvents.SINGLE_ITEM,
  resourceList: amplitudeEvents.RESOURCE_LIST,
  thirdPartyApp: amplitudeEvents.THIRD_PARTY_APP
};

@Injectable()
export class PersonasAmplitudeService {
  constructor(public cpI18n: CPI18nService, public tileUtils: TilesUtilsService) {}

  static getSectionType(contentType) {
    return contentTypeLabels[contentType];
  }

  getContentType(linkData, resourceType) {
    if (linkData.link_url === '' || linkData.link_url === null) {
      return amplitudeEvents.NO_CONTENT;
    } else if (resourceType === ContentUtilsProviders.contentTypes.thirdParty) {
      return amplitudeEvents.THIRD_PARTY_APP;
    } else if (resourceType === ContentUtilsProviders.contentTypes.resourceList) {
      return amplitudeEvents.MULTIPLE_RESOURCES;
    } else if (resourceType === ContentUtilsProviders.contentTypes.web) {
      const webLinkContentType = ContentUtilsProviders.getWebLinkContentType(linkData);
      if (webLinkContentType) {
        return this.cpI18n.translate(webLinkContentType.label);
      } else {
        CPLogger.log(`getWebLinkContentType missing ${linkData}`);
        return;
      }
    }

    const linkLabel = ContentUtilsProviders.resourceTypes()[resourceType].find(
      (l) => l.meta.link_url === linkData.link_url
    ).label;

    return this.cpI18n.translate(linkLabel);
  }

  getTileAmplitudeProperties(tile) {
    const contentType = ContentUtilsProviders.getContentTypeByCampusLink(tile.related_link_data);

    const tile_status = this.tileUtils.isTileVisible(tile)
      ? amplitudeEvents.SHOWN
      : amplitudeEvents.HIDDEN;

    const tile_type = this.tileUtils.isFeatured(tile)
      ? amplitudeEvents.FEATURED
      : amplitudeEvents.NORMAL;

    const section_type = PersonasAmplitudeService.getSectionType(contentType);

    const content_type = this.getContentType(tile.related_link_data, contentType);

    return {
      tile_type,
      tile_status,
      section_type,
      content_type,
      tile_id: tile.id
    };
  }

  getCancelledTileAmplitudeProperties(linkForm, section, guide) {
    const content_type = this.getContentType(linkForm, section);
    const section_type = PersonasAmplitudeService.getSectionType(section);
    const uploaded_image = linkForm.img_url ? amplitudeEvents.YES : amplitudeEvents.NO;
    const tile_type = guide._featuredTile ? amplitudeEvents.FEATURED : amplitudeEvents.NORMAL;

    return {
      tile_type,
      content_type,
      section_type,
      uploaded_image
    };
  }
}
