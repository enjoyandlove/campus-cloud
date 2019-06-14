import { Pipe, PipeTransform } from '@angular/core';

import { IItem } from '@campus-cloud/shared/components';

@Pipe({
  name: 'socialPostcategoryIdToName'
})
export class WallsSocialPostCategoryIdToNamePipe implements PipeTransform {
  transform(categoryId: number, channels: IItem[]): any {
    const channel = channels.find((c) => c.action === categoryId);

    return channel ? channel.label : null;
  }
}
