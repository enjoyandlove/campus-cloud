import { switchMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { CPSession } from '@app/session';
import * as fromActions from './jobs.actions';
import { JobsService } from '@app/containers/controlpanel/manage/jobs/jobs.service';
import { IEmployer } from '@app/containers/controlpanel/manage/jobs/employers/employer.interface';
import { EmployerService } from '@app/containers/controlpanel/manage/jobs/employers/employer.service';

@Injectable()
export class JobsEffects {
  @Effect()
  loadEmployers$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOAD_EMPLOYERS),
    switchMap(() => {
      return this.service
        .getEmployers()
        .pipe(
          map((employers) => new fromActions.LoadEmployersSuccess(employers)),
          catchError((error) => of(new fromActions.LoadEmployersFail(error)))
        );
    })
  );

  @Effect()
  createEmployer$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.CREATE_EMPLOYER),
    map((action: fromActions.CreateEmployer) => action.payload),
    switchMap((employer) => {
      const search = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.employerService
        .createEmployer(employer, search)
        .pipe(
          map(
            (createdEmployer: IEmployer) => new fromActions.CreateEmployerSuccess(createdEmployer)
          ),
          catchError((error) => of(new fromActions.CreateEmployerFail(error)))
        );
    })
  );

  @Effect()
  editEmployer$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.EDIT_EMPLOYER),
    map((action: fromActions.EditEmployer) => action.payload),
    switchMap((employer) => {
      const search = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.employerService
        .editEmployer(employer.id, employer, search)
        .pipe(
          map((createdEmployer: IEmployer) => new fromActions.EditEmployerSuccess(createdEmployer)),
          catchError((error) => of(new fromActions.EditEmployerFail(error)))
        );
    })
  );

  @Effect()
  deleteEmployer$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.DELETE_EMPLOYER),
    map((action: fromActions.DeleteEmployer) => action.payload),
    switchMap((id) => {
      const search = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.employerService
        .deleteEmployer(id, search)
        .pipe(
          map(() => new fromActions.DeleteEmployerSuccess(id)),
          catchError((error) => of(new fromActions.DeleteEmployerFail(error)))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private service: JobsService,
    private employerService: EmployerService
  ) {}
}
