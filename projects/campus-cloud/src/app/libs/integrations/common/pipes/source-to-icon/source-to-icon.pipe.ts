import { Pipe, PipeTransform } from '@angular/core';

import { environment } from '@projects/campus-cloud/src/environments/environment';
import { IntegrationTypes } from '@campus-cloud/libs/integrations/common/model/integration.interface';

@Pipe({ name: 'integrationSourceToIcon' })
export class IntegrationSourceToIconPipe implements PipeTransform {
  transform(source: number) {
    const pathToAsset = `${environment.root}assets/svg/events`;

    if (source === IntegrationTypes.rss) {
      return `${pathToAsset}/int_rss.svg`;
    } else if (source === IntegrationTypes.atom) {
      return `${pathToAsset}/int_atom.svg`;
    } else if (source === IntegrationTypes.ical) {
      return `${pathToAsset}/int_ical.svg`;
    }

    // temporary need to disable OLLWAT event import
    return `${pathToAsset}/int_ical.svg`;
  }
}
