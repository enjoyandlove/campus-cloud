/**
 * Preload lazy loaded modules if data attribute exists in route
 */
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';

export class CPPreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: Function): Observable<any> {
    if (route.data) {
      console.log('loading ', route);
    }

    return route.data && route.data.preload ? load() : Observable.of(null);
  }
}
