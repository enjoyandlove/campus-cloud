import { Pipe, PipeTransform } from '@angular/core';

import { IItem } from '@shared/components';

@Pipe({
  name: 'socialPostcategoryIdToName'
})
export class WallsSocialPostCategoryIdToNamePipe implements PipeTransform {
  transform(categoryId: number, channels: IItem[]): any {
    if (!channels.length) {
      return;
    }
    return channels.find((c) => c.action === categoryId).label;
  }
}
