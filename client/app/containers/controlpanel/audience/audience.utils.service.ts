import { Injectable } from '@angular/core';
import { get as _get } from 'lodash';

import { CPI18nService } from '../../../shared/services';

@Injectable()
export class AudienceUtilsService {
  constructor(private cpI18n: CPI18nService) {}

  parsedAudience(audiences): Array<any> {
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
}
