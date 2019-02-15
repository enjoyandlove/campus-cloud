import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { CPSession } from '@app/session';
import { DiningService } from '../../dining.service';
import { IDining } from '@libs/locations/common/model';

@Injectable()
export class DiningEffect {
  constructor(
    public router: Router,
    public actions$: Actions,
    public session: CPSession,
    public service: DiningService
  ) {}

  @Effect()
  getDining$: Observable<fromActions.GetDiningSuccess | fromActions.GetDiningFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.GET_DINING),
    mergeMap((action: fromActions.GetDining) => {
      const { startRange, endRange, params } = action.payload;

      return this.service.getDining(startRange, endRange, params )
        .pipe(
          map((data: IDining[]) => new fromActions.GetDiningSuccess(data)),
          catchError((error) => of(new fromActions.GetDiningFail(error)))
        );
    })
  );

  @Effect()
  getDiningById$: Observable<fromActions.GetDiningByIdSuccess | fromActions.GetDiningByIdFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.GET_DINING_BY_ID),
    map((action: fromActions.GetDiningById) => action.payload),
    mergeMap(({ diningId }) => {
      const search = new HttpParams()
        .set('school_id', this.session.g.get('school').id);

      return this.service.getDiningById(diningId, search )
        .pipe(
          map((data: IDining) => new fromActions.GetDiningByIdSuccess(data)),
          catchError((error) => of(new fromActions.GetDiningByIdFail(error)))
        );
    })
  );

  @Effect()
  createDining$: Observable<fromActions.PostDiningSuccess | fromActions.PostDiningFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.POST_DINING),
    mergeMap((action: fromActions.PostDining) => {
      const { body, params } = action.payload;

      return this.service
        .createDining(body, params)
        .pipe(
          map((data: IDining) => new fromActions.PostDiningSuccess(data)),
          tap((_) => this.router.navigate(['/manage/dining'])),
          catchError((error) => of(new fromActions.PostDiningFail(error)))
        );
    })
  );

  @Effect()
  deleteDining$: Observable<fromActions.DeleteDiningSuccess | fromActions.DeleteDiningFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.DELETE_DINING),
    mergeMap((action: fromActions.DeleteDining) => {
      const { diningId, params } = action.payload;

      return this.service
        .deleteDiningById(diningId, params)
        .pipe(
          map(() => new fromActions.DeleteDiningSuccess({ deletedId: diningId })),
          catchError((error) => of(new fromActions.DeleteDiningFail(error)))
        );
    })
  );
}
