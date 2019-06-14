import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpFilterByLength' })
export class CPFIlterByLength implements PipeTransform {
  transform(value: Array<any>, cutoff: number): any {
    return value.filter((_, index) => index < cutoff);
  }
}
