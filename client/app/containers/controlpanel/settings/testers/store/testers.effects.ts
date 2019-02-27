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
import { TestersService } from '../testers.service';
import { ITestUser } from '@libs/testers/model/test-user.interface';

@Injectable()
export class TestersEffects {
  constructor(
    public actions$: Actions,
    public cpI18n: CPI18nService,
    public service: TestersService,
    public store: Store<ITestersState>
  ) {}

  somethingWentWrong = { error: this.cpI18n.translate('something_went_wrong') };

  @Effect()
  getTesters$: Observable<actions.LoadTestersOK | actions.LoadTestersFail> = this.actions$.pipe(
    ofType(actions.TestersActions.LOAD),
    withLatestFrom(this.store.select(selectors.getTestersState)),
    mergeMap(([_, state]) => {
      const { range, sort_direction, search_str } = state;
      const search = new HttpParams()
        .set('sort_direction', sort_direction)
        .set('search_str', search_str);
      return this.service.getUsers(range.start, range.end, search).pipe(
        map((users: ITestUser[]) => new actions.LoadTestersOK(users)),
        catchError(() => {
          this.store.dispatch(
            new baseActionClass.SnackbarError({ body: this.somethingWentWrong.error })
          );
          return of(new actions.LoadTestersFail());
        })
      );
    })
  );
}
