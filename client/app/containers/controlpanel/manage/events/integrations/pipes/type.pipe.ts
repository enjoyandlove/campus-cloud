import { Pipe, PipeTransform } from '@angular/core';

import { EventIntegration } from '../model';

@Pipe({ name: 'cpEventIntegrationType' })
export class EventIntegrationTypePipe implements PipeTransform {
  transform(value: number): any {
    if (value === EventIntegration.types.atom) {
      return 'ATOM';
    } else if (value === EventIntegration.types.ical) {
      return 'ICAL';
    } else if (value === EventIntegration.types.rss) {
      return 'RSS';
    }
  }
}
