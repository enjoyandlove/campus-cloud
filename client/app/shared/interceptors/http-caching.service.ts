import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpInterceptor,
  HttpHandler
} from '@angular/common/http';

import { RequestCache } from '../services/request-cache.service';

@Injectable()
export class HttpCachingInterceptor implements HttpInterceptor {
  constructor(private cache: RequestCache) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const cachedResponse = this.cache.get(req);
    return cachedResponse ? of(cachedResponse) : this.sendRequest(req, next, this.cache);
  }

  sendRequest(
    req: HttpRequest<any>,
    next: HttpHandler,
    cache: RequestCache
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        const cacheControlHeader = req.headers.get('Cache-Control');

        if (cacheControlHeader === 'no-cache') {
          return;
        }

        if (event instanceof HttpResponse) {
          cache.put(req, event);
        }
      })
    );
  }
}
