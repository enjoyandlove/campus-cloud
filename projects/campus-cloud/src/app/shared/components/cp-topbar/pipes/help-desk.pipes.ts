import { Pipe, PipeTransform } from '@angular/core';

import { FORMAT } from '@campus-cloud/shared/pipes';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPI18nService } from '@campus-cloud/shared/services';

@Pipe({ name: 'lastUpdateDate' })
export class HelpDeskPipes implements PipeTransform {
  constructor() {}

  transform(time): string {
    const lastBuildTime = new Date(time);
    const lastSevenDaysFromNow = CPDate.localNow().diff(lastBuildTime, 'days');

    const localizedTimeFromNow = CPDate.localNow(lastBuildTime)
      .locale(CPI18nService.getLocale())
      .fromNow();

    return lastSevenDaysFromNow <= 7
      ? localizedTimeFromNow
      : CPDate.localNow(lastBuildTime).format(FORMAT.SHORT);
  }
}
