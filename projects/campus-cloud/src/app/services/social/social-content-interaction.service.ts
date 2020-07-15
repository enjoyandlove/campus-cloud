import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '@campus-cloud/base/services';

export interface SocialContentInteractionItem {
  id: number;
  name: string;
  email?: string; // Keeping email as optional since this field would not be present for originator type of store
  originator_type: OriginatorType;
}

export enum InteractionLikeType {
  like = 1,
  dislike = -1
}

export enum OriginatorType {
  user = 1,
  store = 2
}

export enum InteractionContentType {
  campusThread = 1,
  campusComment = 2,
  socialGroupThread = 3,
  socialGroupComment = 4
}

@Injectable({
  providedIn: 'root'
})
export class SocialContentInteractionService {
  base = `${this.api.BASE_URL}/${this.api.VERSION.V1}`;
  endpoint = this.api.ENDPOINTS.SOCIAL_CONTENT_INTERACTION;

  constructor(private api: ApiService) {}

  get(
    startRange: number,
    endRange: number,
    params: HttpParams
  ): Observable<SocialContentInteractionItem[]> {
    const url = `${this.base}/${this.endpoint}/${startRange};${endRange}`;

    return this.api.get(url, params, true) as Observable<SocialContentInteractionItem[]>;
  }
}
