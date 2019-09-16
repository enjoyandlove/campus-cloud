import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';

import { environment } from '@projects/campus-cloud/src/environments/environment';

@Injectable()
export class ControlPanelService {
  constructor(private http: HttpClient) {}

  getBeamerPosts() {
    const headers = new HttpHeaders().set('Beamer-Api-Key', environment.keys.beamerApiKey);
    const params = new HttpParams().set('published', 'true').set('maxResults', '1');

    return this.http.get('https://api.getbeamer.com/v0/posts', { headers, params }).pipe(
      map((res) => res[0]),
      catchError(() => EMPTY)
    );
  }
}
