import { map, mergeMap, catchError, tap, filter, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { ISnackbar } from '@app/store';
import { CPSession } from '@app/session';
import * as fromActions from '../actions';
import { CPI18nService } from '@shared/services';
import { baseActionClass } from '@app/store/base';
import { DiningService } from '../../dining.service';
import { IDining } from '@libs/locations/common/model';
import * as fromDiningCategoryStore from '../../categories/store';
import { ICategory } from '@libs/locations/common/categories/model';

@Injectable()
export class DiningEffect {
  constructor(
    public router: Router,
    public actions$: Actions,
    public session: CPSession,
    public cpI18n: CPI18nService,
    public service: DiningService,
    public store: Store<ISnackbar>
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
  getFilteredDining$: Observable<fromActions.GetFilteredDiningSuccess | fromActions.GetFilteredDiningFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.GET_FILTERED_DINING),
    mergeMap((action: fromActions.GetFilteredDining) => {
      const { startRange, endRange, params } = action.payload;

      return this.service.getDining(startRange, endRange, params )
        .pipe(
          map((data: IDining[]) => new fromActions.GetFilteredDiningSuccess(data)),
          catchError((error) => of(new fromActions.GetFilteredDiningFail(error)))
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
          tap((data) => this.router.navigate([`/manage/dining/${data.payload.id}/info`])),
          catchError((error) => {
            this.store.dispatch(
              new baseActionClass.SnackbarError({
                body: this.cpI18n.translate('something_went_wrong')
              })
            );

            return of(new fromActions.PostDiningFail(error));
          })
        );
    })
  );

  @Effect()
  createDiningSuccess$: Observable<fromDiningCategoryStore.GetCategoriesSuccess>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.POST_DINING_SUCCESS),
    map((action: fromActions.PostDiningSuccess) => action.payload),
    withLatestFrom(this.store.select(fromDiningCategoryStore.getCategories)),
    map(([{ category_id }, categories]) => {
      return categories.map((category: ICategory) => {
        if (category.id === category_id) {
          category = {
            ...category,
            locations_count: category.locations_count + 1
          };
        }

        return category;
      });
    }),
    filter((c: ICategory[]) => !!c.length),
    mergeMap((c) => of(new fromDiningCategoryStore.GetCategoriesSuccess(c)))
  );

  @Effect()
  editDining$: Observable<fromActions.EditDiningSuccess | fromActions.EditDiningFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.EDIT_DINING),
    mergeMap((action: fromActions.EditDining) => {
      const { diningId, categoryId, body, params } = action.payload;

      return this.service
        .updateDining(body, diningId, params)
        .pipe(
          map((data: IDining) => new fromActions.EditDiningSuccess({ data, categoryId })),
          tap((_) => this.router.navigate([`/manage/dining/${diningId}/info`])),
          catchError((error) => {
            this.store.dispatch(
              new baseActionClass.SnackbarError({
                body: this.cpI18n.translate('something_went_wrong')
              })
            );

            return of(new fromActions.EditDiningFail(error));
          })
        );
    })
  );

  @Effect()
  editDiningSuccess$: Observable<fromDiningCategoryStore.GetCategoriesSuccess>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.EDIT_DINING_SUCCESS),
    map((action: fromActions.EditDiningSuccess) => action.payload),
    withLatestFrom(this.store.select(fromDiningCategoryStore.getCategories)),
    map(([dining, categories]) => {
      return categories.map((category: ICategory) => {
        if (category.id === dining['categoryId']) {
          category = {
            ...category,
            locations_count: category.locations_count - 1
          };
        }

        if (category.id === dining['data'].category_id) {
          category = {
            ...category,
            locations_count: category.locations_count + 1
          };
        }

        return category;
      });
    }),
    filter((c: ICategory[]) => !!c.length),
    mergeMap((c) => of(new fromDiningCategoryStore.GetCategoriesSuccess(c)))
  );

  @Effect()
  deleteDining$: Observable<fromActions.DeleteDiningSuccess | fromActions.DeleteDiningFail>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.DELETE_DINING),
    mergeMap((action: fromActions.DeleteDining) => {
      const { diningId, categoryId, params } = action.payload;

      return this.service
        .deleteDiningById(diningId, params)
        .pipe(
          map(() => new fromActions.DeleteDiningSuccess({ deletedId: diningId, categoryId })),
          catchError((error) => of(new fromActions.DeleteDiningFail(error)))
        );
    })
  );

  @Effect()
  deleteDiningSuccess$: Observable<fromDiningCategoryStore.GetCategoriesSuccess>
    = this.actions$.pipe(
    ofType(fromActions.diningActions.DELETE_DINING_SUCCESS),
    map((action: fromActions.DeleteDiningSuccess) => action.payload),
    withLatestFrom(this.store.select(fromDiningCategoryStore.getCategories)),
    map(([{ categoryId }, categories]) => {
      return categories.map((category: ICategory) => {
        if (category.id === categoryId) {
          category = {
            ...category,
            locations_count: category.locations_count - 1
          };
        }

        return category;
      });
    }),
    filter((c: ICategory[]) => !!c.length),
    mergeMap((c) => of(new fromDiningCategoryStore.GetCategoriesSuccess(c)))
  );
}
