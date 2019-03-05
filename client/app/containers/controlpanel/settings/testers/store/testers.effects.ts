import { mergeMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import * as actions from './testers.actions';
import { baseActionClass } from '@app/store';
import { ITestersState } from './testers.state';
import * as selectors from './testers.selectors';
import { CPI18nService } from '@shared/services';
import { ITestUser } from '../models/test-user.interface';
import { CampusTestersService } from '../campus-testers.service';

@Injectable()
export class TestersEffects {
  constructor(
    public actions$: Actions,
    public cpI18n: CPI18nService,
    public store: Store<ITestersState>,
    public service: CampusTestersService
  ) {}

  somethingWentWrong = this.cpI18n.translate('something_went_wrong');

  @Effect()
  getTesters$: Observable<actions.LoadTestersOK | actions.LoadTestersFail> = this.actions$.pipe(
    ofType(actions.TestersActions.LOAD),
    withLatestFrom(this.store.select(selectors.getTestersState)),
    mergeMap(([_, state]) => {
      const { range, sortDirection, searchStr } = state;
      const search = new HttpParams()
        .set('sort_direction', sortDirection)
        .set('search_str', searchStr);
      return this.service
        .getUsers(range.start, range.end, search)
        .pipe(
          map((users: ITestUser[]) => new actions.LoadTestersOK(users)),
          catchError(() => this.errorSnackbarAndFail(new actions.LoadTestersFail()))
        );
    })
  );

  @Effect()
  deleteTester$: Observable<actions.DeleteTesterOK | actions.DeleteTesterFail> = this.actions$.pipe(
    ofType(actions.TestersActions.DELETE),
    map((action: actions.DeleteTester) => action.payload),
    mergeMap((id: number) => {
      return this.service
        .deleteUser(id)
        .pipe(
          map(() => new actions.DeleteTesterOK(id)),
          catchError(() => this.errorSnackbarAndFail(new actions.DeleteTesterFail()))
        );
    })
  );

  @Effect()
  createTesters$: Observable<
    actions.CreateTestersOK | actions.CreateTestersFail
  > = this.actions$.pipe(
    ofType(actions.TestersActions.CREATE),
    map((action: actions.CreateTesters) => action.payload),
    mergeMap((emails: string[]) => {
      return this.service
        .createUsers(emails)
        .pipe(
          map((testers: ITestUser[]) => new actions.CreateTestersOK(testers)),
          catchError(() => this.errorSnackbarAndFail(new actions.CreateTestersFail()))
        );
    })
  );

  errorSnackbarAndFail(failAction) {
    this.store.dispatch(new baseActionClass.SnackbarError({ body: this.somethingWentWrong }));
    return of(failAction);
  }
}
