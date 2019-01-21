import { map, mergeMap, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { DiningService } from '../../dining.service';
import { ILocation } from '@libs/locations/common/model';

@Injectable()
export class DiningEffect {
  constructor(
    public router: Router,
    public actions$: Actions,
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
          map((data: ILocation[]) => new fromActions.GetDiningSuccess(data)),
          catchError((error) => of(new fromActions.GetDiningFail(error)))
        );
    })
  );
}
