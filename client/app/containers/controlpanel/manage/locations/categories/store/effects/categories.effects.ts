import { map, mergeMap, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { ICategory } from '../../categories.interface';
import { CategoriesService } from '../../categories.service';

@Injectable()
export class CategoriesEffects {
  constructor(
    public actions$: Actions,
    public service: CategoriesService
  ) {}

  @Effect()
  getCategories$: Observable<fromActions.GetCategoriesSuccess | fromActions.GetCategoriesFail>
    = this.actions$.pipe(
    ofType(fromActions.CategoriesActions.GET_CATEGORIES),
    mergeMap((action: fromActions.GetCategories) => {
      const { params } = action.payload;

      return this.service.getCategories(params)
        .pipe(
          map((data: ICategory[]) => new fromActions.GetCategoriesSuccess(data)),
          catchError((error) => of(new fromActions.GetCategoriesFail(error)))
        );
    })
  );
}
