import { catchError, map, tap, mergeMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

import * as fromActions from '../actions';
import { ISnackbar } from '@campus-cloud/store';
import { CPSession } from '@campus-cloud/session';
import { IPublicApiAccessToken } from '../../model';
import { Paginated } from '@campus-cloud/shared/utils';
import { baseActionClass } from '@campus-cloud/store/base';
import { CPI18nService } from '@campus-cloud/shared/services';
import { commonParams } from '@campus-cloud/shared/constants';
import { ApiManagementService } from '../../api-management.service';

@Injectable()
export class ApiManagementEffect extends Paginated {
  constructor(
    private router: Router,
    private action$: Actions,
    private session: CPSession,
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

        return this.service.getTokens(this.startRage, this.endRange, this.getParams()).pipe(
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

  loadRequestByIdEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(fromActions.loadRequestById),
      mergeMap((action) => {
        const { tokenId } = action;

        return this.service.getTokenById(tokenId).pipe(
          map((data: IPublicApiAccessToken) => fromActions.loadRequestByIdSuccess({ data })),
          catchError((error) => {
            this.handleError();
            return of(fromActions.loadRequestByIdFailure(error));
          })
        );
      })
    );
  });

  postRequestEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(fromActions.postRequest),
      mergeMap((action) => {
        return this.service.postToken(action.payload).pipe(
          map((data: IPublicApiAccessToken) => fromActions.postSuccess({ data })),
          tap(() => {
            this.handleSuccess('t_api_management_access_token_created');
            this.router.navigate(['/api-management']);
          }),
          catchError((error) => {
            this.handleError();
            return of(fromActions.postFailure(error));
          })
        );
      })
    );
  });

  editRequestEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(fromActions.editRequest),
      mergeMap((action) => {
        const { tokenId, body } = action.payload;

        return this.service.editToken(tokenId, body).pipe(
          map((data: IPublicApiAccessToken) => {
            this.handleSuccess('t_api_management_access_token_edited');
            return fromActions.editSuccess({ data });
          }),
          catchError((error) => {
            this.handleError();
            return of(fromActions.editFailure(error));
          })
        );
      })
    );
  });

  deleteRequestEffect$ = createEffect(() => {
    return this.action$.pipe(
      ofType(fromActions.deleteRequest),
      mergeMap((action) => {
        return this.service.deleteToken(action.payload.id, this.getParams()).pipe(
          map(() => {
            this.handleSuccess('t_api_management_access_token_delete');
            return fromActions.deleteSuccess({ deletedId: action.payload.id });
          }),
          catchError((error) => {
            this.handleError();
            return of(fromActions.deleteFailure(error));
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

  private handleSuccess(key) {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate(key)
      })
    );
  }

  private getParams() {
    const { client_id, is_sandbox } = this.session.g.get('school');

    return new HttpParams().set('client_id', client_id).set('is_sandbox', is_sandbox);
  }
}
