import { HttpParams, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { mockMember } from '@libs/members/common/tests';
import { mockSocialPostCategory } from '../../../feeds/tests';

export class MockLibsCommonMembersService {
  placeholder: any;
  getMembers(search: HttpParams, startRange: number, endRange: number) {
    this.placeholder = { search, startRange, endRange };

    return of([mockMember]);
  }

  getSocialGroupDetails(search: HttpParams) {
    this.placeholder = { search };
    return of([mockSocialPostCategory]);
  }

  removeMember(body: any, memberId: number) {
    this.placeholder = { body, memberId };
    return of(new HttpResponse({ status: 201 }));
  }

  addMember(body: any, memberId: number) {
    body = {
      ...body,
      id: memberId
    };

    return of(body);
  }
}
