import { switchMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as fromActions from './jobs.actions';
import { JobsService } from '../../../containers/controlpanel/manage/jobs/jobs.service';

@Injectable()
export class JobsEffects {
  @Effect()
  loadEmployers$: Observable<Action> = this.actions$.ofType(fromActions.LOAD_EMPLOYERS).pipe(
    switchMap(() => {
      return this.service
        .getEmployers()
        .pipe(
          map((employers) => new fromActions.LoadEmployersSuccess(employers)),
          catchError((error) => of(new fromActions.LoadEmployersFail(error)))
        );
    })
  );

  constructor(private service: JobsService, private actions$: Actions) {}
}
