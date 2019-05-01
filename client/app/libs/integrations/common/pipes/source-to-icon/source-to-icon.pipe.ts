import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '@client/environments/environment';
import { IntegrationTypes } from '@libs/integrations/common/model/integration.interface';

@Pipe({ name: 'integrationSourceToIcon' })
export class IntegrationSourceToIconPipe implements PipeTransform {
  transform(source: number) {
    const pathToAsset = `${environment.root}public/svg/events`;

    if (source === IntegrationTypes.rss) {
      return `${pathToAsset}/int_rss.svg`;
    } else if (source === IntegrationTypes.atom) {
      return `${pathToAsset}/int_atom.svg`;
    } else if (source === IntegrationTypes.ical) {
      return `${pathToAsset}/int_ical.svg`;
    }
  }
}
