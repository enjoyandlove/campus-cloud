import { Pipe, PipeTransform } from '@angular/core';

import { isDefault } from '../categories.status';

@Pipe({ name: 'cpIsDefaultCategory' })
export class CategoryTypePipe implements PipeTransform {
  transform(value): any {
    return isDefault[value];
  }
}
