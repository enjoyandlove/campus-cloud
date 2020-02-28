import { Pipe, PipeTransform } from '@angular/core';

import { urlify } from '@campus-cloud/shared/utils';

@Pipe({ name: 'cpUrlify' })
export class CPUrlify implements PipeTransform {
  constructor() {}
  transform(input: string) {
    if (!input) {
      return input;
    }
    return urlify(input);
  }
}
