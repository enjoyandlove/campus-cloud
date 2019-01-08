import { switchMap, map, catchError } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { CPSession } from '@app/session';
import * as fromActions from './deals.actions';
import { DealsService } from '@app/containers/controlpanel/manage/deals/deals.service';
import { DealsStoreService } from '@app/containers/controlpanel/manage/deals/stores/store.service';

@Injectable()
export class DealsEffects {
  @Effect()
  loadStores$: Observable<Action> = this.actions$.ofType(fromActions.LOAD_STORES).pipe(
    switchMap(() => {
      return this.service
        .getDealStores()
        .pipe(
          map((stores) => new fromActions.LoadStoresSuccess(stores)),
          catchError((error) => of(new fromActions.LoadStoresFail(error)))
        );
    })
  );

  @Effect()
  createStore$: Observable<Action> = this.actions$.ofType(fromActions.CREATE_STORE).pipe(
    map((action: fromActions.CreateStore) => action.payload),
    switchMap((store) => {
      const search = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.storeService
        .createStore(store, search)
        .pipe(
          map((createdStore) => new fromActions.CreateStoreSuccess(createdStore)),
          catchError((error) => of(new fromActions.CreateStoreFail(error)))
        );
    })
  );

  @Effect()
  editStore$: Observable<Action> = this.actions$.ofType(fromActions.EDIT_STORE).pipe(
    map((action: fromActions.EditStore) => action.payload),
    switchMap((store) => {
      const search = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.storeService
        .editStore(store.id, store, search)
        .pipe(
          map((editedStore) => new fromActions.EditStoreSuccess(editedStore)),
          catchError((error) => of(new fromActions.EditStoreFail(error)))
        );
    })
  );

  @Effect()
  deleteStore$: Observable<Action> = this.actions$.ofType(fromActions.DELETE_STORE).pipe(
    map((action: fromActions.DeleteStore) => action.payload),
    switchMap((id) => {
      const search = new HttpParams().append('school_id', this.session.g.get('school').id);
      return this.storeService
        .deleteStore(id, search)
        .pipe(
          map(() => new fromActions.DeleteStoreSuccess(id)),
          catchError((error) => of(new fromActions.DeleteStoreFail(error)))
        );
    })
  );

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private service: DealsService,
    private storeService: DealsStoreService
  ) {}
}
