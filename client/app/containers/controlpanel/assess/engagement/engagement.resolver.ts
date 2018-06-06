import { Observable, of as observableOf, combineLatest } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';

import { CPSession } from './../../../../session';
import { EngagementService } from './engagement.service';

const SERVICE_WITH_ATTENDANCE = '1';

@Injectable()
export class EngagementResolver implements Resolve<any> {
  constructor(private session: CPSession, private service: EngagementService) {}

  resolve(): Observable<any> {
    const search = new HttpParams().append('school_id', this.session.g.get('school').id.toString());

    const serviceSearch = new HttpParams()
      .append('attendance_only', SERVICE_WITH_ATTENDANCE)
      .append('school_id', this.session.g.get('school').id.toString());

    const servicesList$ = this.service
      .getServices(undefined, undefined, serviceSearch)
      .pipe(catchError((_) => observableOf([])));

    const listsList$ = this.service
      .getLists(undefined, undefined, search)
      .pipe(catchError((_) => observableOf([])));

    const stream$ = combineLatest(servicesList$, listsList$);

    return stream$;
  }
}
