import { Injectable } from '@angular/core';

import { TilesUtilsService } from './tiles/tiles.utils.service';
import { amplitudeEvents } from '@campus-cloud/shared/constants';
import { CPI18nService, CPLogger } from '@campus-cloud/shared/services';
import { CampusLink } from '@controlpanel/customise/personas/tiles/tile';
import { ContentUtilsProviders } from '@campus-cloud/libs/studio/providers';
import {
  PersonasType,
  credentialType,
  PersonasLoginRequired
} from '@controlpanel/customise/personas/personas.status';

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

  static getStatus(status) {
    return status ? amplitudeEvents.ENABLED : amplitudeEvents.DISABLED;
  }

  static getExperienceAmplitudeProperties(persona, isSecurityService = false, personaId = null) {
    const experience_type =
      persona.platform === PersonasType.web ? amplitudeEvents.WEB : amplitudeEvents.MOBILE;

    const experience_id = personaId ? personaId : persona.id;
    const campus_security = isSecurityService ? amplitudeEvents.YES : amplitudeEvents.NO;
    const isCustomizationDisabled =
      persona.platform === PersonasType.web ||
      persona.login_requirement === PersonasLoginRequired.forbidden;

    const my_courses = isCustomizationDisabled
      ? amplitudeEvents.DISABLED
      : this.getStatus(persona.home_my_courses_enabled);

    const upcoming_deadlines = isCustomizationDisabled
      ? amplitudeEvents.DISABLED
      : this.getStatus(persona.home_due_dates_enabled);

    const todays_schedule = isCustomizationDisabled
      ? amplitudeEvents.DISABLED
      : this.getStatus(persona.home_todays_schedule_enabled);

    return {
      my_courses,
      experience_id,
      experience_type,
      campus_security,
      todays_schedule,
      upcoming_deadlines,
      credential_type: credentialType[persona.login_requirement]
    };
  }

  getContentType(linkData, resourceType) {
    if (linkData.link_url === '' || linkData.link_url === null) {
      return amplitudeEvents.NO_CONTENT;
    } else if (linkData.link_url === CampusLink.integration) {
      return amplitudeEvents.INTEGRATIONS;
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
        return amplitudeEvents.NO_CONTENT;
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
