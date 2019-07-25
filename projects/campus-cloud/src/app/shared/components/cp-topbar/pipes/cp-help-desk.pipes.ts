import { Pipe, PipeTransform } from '@angular/core';

import { CPSession } from '@campus-cloud/session';
import { CPDate } from '@campus-cloud/shared/utils';
import { CPDatePipe, FORMAT } from '@campus-cloud/shared/pipes';

@Pipe({ name: 'cpLastUpdateDate' })
export class CPHelpDeskPipes implements PipeTransform {
  constructor(private session: CPSession, private datePipe: CPDatePipe) {}

  transform(time): string {
    const now = CPDate.now(this.session.tz);
    const lastBuildTimeEpoch = CPDate.toEpoch(time, this.session.tz);
    const fromEpoch = CPDate.fromEpoch(lastBuildTimeEpoch, this.session.tz);

    const lastSevenDays = now.diff(fromEpoch, 'days') < 7;

    return lastSevenDays
      ? fromEpoch.from(now)
      : this.datePipe.transform(lastBuildTimeEpoch, FORMAT.SHORT);
  }
}
