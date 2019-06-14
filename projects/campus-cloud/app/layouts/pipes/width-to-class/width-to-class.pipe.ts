import { Pipe, PipeTransform } from '@angular/core';

import { LayoutWidth } from '@app/layouts/interfaces';

@Pipe({
  name: 'widthToClass'
})
export class WidthToClassPipe implements PipeTransform {
  transform(value: LayoutWidth): any {
    if (value === LayoutWidth.full) {
      return 'col-12';
    }
    if (value === LayoutWidth.half) {
      return 'col-lg-6 col-sm-12';
    }
    if (value === LayoutWidth.fourth) {
      return 'col-12 col-lg-4 col-md-6';
    }
    if (value === LayoutWidth.third) {
      return 'col-xs-12 col-sm-8';
    }
    return null;
  }
}
