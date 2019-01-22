import { Injectable } from '@angular/core';

import { IItem } from '@shared/components/cp-dropdown';
import { FeedIntegration } from './../model/integration.model';

@Injectable()
export class CommonIntegrationUtilsService {
  typesDropdown(): IItem[] {
    return [
      {
        action: FeedIntegration.types.rss,
        label: 'RSS'
      },
      {
        action: FeedIntegration.types.atom,
        label: 'Atom'
      },
      {
        action: FeedIntegration.types.ical,
        label: 'iCal'
      }
    ];
  }
}
