import { switchMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import * as fromActions from './deals.actions';
import { DealsService } from '../../../containers/controlpanel/manage/deals/deals.service';

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

  constructor(private service: DealsService, private actions$: Actions) {}
}
