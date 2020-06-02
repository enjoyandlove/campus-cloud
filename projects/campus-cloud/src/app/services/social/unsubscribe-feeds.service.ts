import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { UnsubscribeService } from '@campus-cloud/containers/unsubscribe/unsubscribe.service';

export enum EmailType {
  feedEmailDigest = 14
}

export class MockUnsubscribe {
  unsubscribe() {
    of({});
  }
}

@Injectable({
  providedIn: 'root'
})
export class UnsubscribeFeedsService {
  constructor(private api: UnsubscribeService) {}

  unsubscribe(data) {
    const url = `${this.api.BASE_URL}/${this.api.VERSION.V1}/${this.api.ENDPOINTS.EXTERNAL_EMAIL_UNSUBSCRIBE}/`;

    return this.api.post(url, data, null, true);
  }
}
