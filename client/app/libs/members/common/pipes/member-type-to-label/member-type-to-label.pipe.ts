import { Pipe, PipeTransform } from '@angular/core';

import { MemberType } from '../../model';

@Pipe({ name: 'memberTypeToLabel' })
export class MemberTypeToLabelPipe implements PipeTransform {
  transform(memberType: number, executiveLabel: string) {
    return memberType === MemberType.executive_leader ? executiveLabel : 'member';
  }
}
