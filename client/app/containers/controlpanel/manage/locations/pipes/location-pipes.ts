import { Pipe, PipeTransform } from '@angular/core';

import { LocationsUtilsService } from '../locations.utils';

@Pipe({ name: 'cpTimeLabel' })
export class CPTimeLabel implements PipeTransform {
  transform(time): string {
    const openingHours = LocationsUtilsService.getLocationTiming()
      .find((t) => t.value === time);

    if (openingHours) {
      return openingHours.label;
    }
  }
}

@Pipe({ name: 'cpDayLabel' })
export class CPDayLabel implements PipeTransform {
  transform(day): number {
    return LocationsUtilsService.getScheduleLabel(day);
  }
}
