import { CPSession } from './../../../../session/index';
import { EngagementService } from './engagement.service';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

const SERVICE_WITH_ATTENDANCE = '1';

@Injectable()
export class EngagementResolver implements Resolve<any> {
  constructor(
    private session: CPSession,
    private service: EngagementService
  ) { }

  resolve(): Observable<any> {

    let search = new URLSearchParams();
    search.append('school_id', this.session.school.id.toString());

    let serviceSearch = new URLSearchParams();
    serviceSearch.append('attendance_only', SERVICE_WITH_ATTENDANCE);

    const servicesList$ = this
      .service
      .getServices(undefined, undefined, serviceSearch)
      .catch(_ => Observable.of([]));

    const listsList$ = this
      .service
      .getLists(undefined, undefined, search)
      .catch(_ => Observable.of([]));

    const stream$ = Observable.combineLatest(servicesList$, listsList$);

    return stream$;
  }
}

