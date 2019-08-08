import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromActions from '../actions';
import { ISnackbar } from '@campus-cloud/store';
import { Paginated } from '@campus-cloud/shared/utils';
import { baseActionClass } from '@campus-cloud/store/base';
import { CPI18nService } from '@campus-cloud/shared/services';
import { commonParams } from '@campus-cloud/shared/constants';
import { ApiManagementService } from '../../api-management.service';
import { IPublicApiAccessToken } from '../../api-management.interface';

@Injectable()
export class ApiManagementEffect extends Paginated {
  constructor(
    private action$: Actions,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
    private store: Store<ISnackbar>,
    private service: ApiManagementService
  ) {
    super();
  }

  loadRequestEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(fromActions.loadRequest),
      mergeMap(() => {
        const queryParams = this.route.snapshot.queryParams;
        this.page = queryParams[commonParams.page];

        return this.service.getTokens(this.startRage, this.endRange).pipe(
          map((data: IPublicApiAccessToken[]) =>
            fromActions.loadSuccess(this.paginateResults(data))
          ),
          catchError((error) => {
            this.handleError();
            return of(fromActions.loadFailure(error));
          })
        );
      })
    );
  });

  private handleError() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }
}
