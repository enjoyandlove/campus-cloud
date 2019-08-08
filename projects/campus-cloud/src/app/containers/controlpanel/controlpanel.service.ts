import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { environment } from '@projects/campus-cloud/src/environments/environment';

@Injectable()
export class ControlPanelService {
  constructor(private http: HttpClient) {}

  getBeamerPosts() {
    const headers = new HttpHeaders().set('Beamer-Api-Key', environment.keys.beamnerApiKey);
    const params = new HttpParams().set('published', 'true').set('maxResults', '1');

    return this.http
      .get('https://api.getbeamer.com/v0/posts', { headers, params })
      .pipe(map((res) => res[0]));
  }
}
