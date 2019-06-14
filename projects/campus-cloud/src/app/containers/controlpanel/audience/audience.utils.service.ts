import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { CPI18nService } from '@shared/services';
import { amplitudeEvents } from '@shared/constants';

@Injectable()
export class AudienceUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  parsedAudience(audiences): Array<any> {
    const heading = {
      action: null,
      heading: true,
      label: this.cpI18n.translate('audience_my_audiences')
    };

    audiences = audiences.map((audience) => {
      const users = _get(audience, 'count', null);

      return {
        isList: true,
        userCount: users,
        action: audience.id,
        label: audience.name,
        type: audience.type
      };
    });

    if (audiences.length) {
      audiences.unshift(heading);
    }

    return audiences;
  }

  parsedPersona(persona): Array<any> {
    const _persona = [];

    const heading = {
      action: null,
      heading: true,
      label: this.cpI18n.translate('t_notify_announcement_audiences_my_experiences')
    };

    persona.map((p) => {
      const users = _get(p, 'user_count', null);

      _persona.push({
        action: p.id,
        type: 'persona',
        isPersona: true,
        userCount: users,
        label: this.getLocalizedLabel(p.localized_name_map)
      });
    });

    if (_persona.length) {
      _persona.unshift(heading);
    }

    return _persona;
  }

  getLocalizedLabel(label) {
    return CPI18nService.getLocale().startsWith('fr') ? label.fr : label.en;
  }

  getAmplitudeEvent(audience, filterCount = false) {
    let eventProperties: any = {
      audience_type: audience.filters
        ? amplitudeEvents.DYNAMIC_AUDIENCE
        : amplitudeEvents.CUSTOM_AUDIENCE
    };
    if (filterCount && audience.filters) {
      eventProperties = {
        ...eventProperties,
        filter_count: audience.filters.length
      };
    }
    return eventProperties;
  }
}
