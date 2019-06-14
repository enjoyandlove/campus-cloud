import { Pipe, PipeTransform } from '@angular/core';

import { FeedIntegration } from '../model';

@Pipe({ name: 'cpIntegrationType' })
export class IntegrationTypePipe implements PipeTransform {
  transform(value: number): any {
    if (value === FeedIntegration.types.atom) {
      return 'Atom';
    } else if (value === FeedIntegration.types.ical) {
      return 'iCal';
    } else if (value === FeedIntegration.types.rss) {
      return 'RSS';
    }
  }
}
