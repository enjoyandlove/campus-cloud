import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpAudienceFilterPipe' })
export class AudienceFilterPipe implements PipeTransform {
  transform(filters: any, usedFilters): any {
    return filters.filter((value) => !usedFilters.includes(value.id));
  }
}
