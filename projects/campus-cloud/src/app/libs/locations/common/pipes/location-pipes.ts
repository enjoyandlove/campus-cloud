import { Pipe, PipeTransform } from '@angular/core';

import { LocationsUtilsService } from '../utils';

@Pipe({ name: 'locationsTimeLabel' })
export class LocationsTimeLabelPipe implements PipeTransform {
  transform(time): string {
    const openingHours = LocationsUtilsService.getLocationTiming().find((t) => t.value === time);

    if (openingHours) {
      return openingHours.label;
    }
  }
}

@Pipe({ name: 'locationsDayLabel' })
export class LocationsDayLabelPipe implements PipeTransform {
  transform(day): string {
    return LocationsUtilsService.getScheduleLabel(day);
  }
}
