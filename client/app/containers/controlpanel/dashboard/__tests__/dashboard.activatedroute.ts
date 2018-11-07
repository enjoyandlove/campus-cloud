import { Observable, Subject } from 'rxjs';
import { Params } from '@angular/router';

export class MockRouter {
  _queryParams: Subject<any> = new Subject();

  get queryParams(): Observable<Params> {
    return this._queryParams;
  }

  snapshot = {
    queryParams: 1
  };

  _setParam(params: Params) {
    this._queryParams.next({ ...params });
  }

  navigate() {
    return;
  }
}
