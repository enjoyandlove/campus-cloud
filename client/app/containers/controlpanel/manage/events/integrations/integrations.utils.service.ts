import { Injectable } from '@angular/core';

import { IItem } from '@shared/components/cp-dropdown';
import { EventIntegration } from './model/integration.model';

@Injectable()
export class IntegrationsUtilsService {
  constructor() {}

  typesDropdown(): IItem[] {
    return [
      {
        action: EventIntegration.types.rss,
        label: 'RSS'
      },
      {
        action: EventIntegration.types.atom,
        label: 'ATOM'
      },
      {
        action: EventIntegration.types.ical,
        label: 'ICAL'
      }
    ];
  }
}
