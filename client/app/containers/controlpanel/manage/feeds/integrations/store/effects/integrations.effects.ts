import { mergeMap, map, catchError } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import * as fromActions from '../actions';
import { IItem } from '@shared/components';
import { IWallsIntegration } from '@libs/integrations/walls/model';
import { WallsIntegrationsService } from '../../walls-integrations.service';

@Injectable()
export class IntegrationsEffects {
  @Effect()
  getIntegrations$: Observable<
    fromActions.GetIntegrationsSuccess | fromActions.GetIntegrationsFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_INTEGRATIONS),
    mergeMap((action: fromActions.GetIntegrations) => {
      const { startRange, endRange, params } = action.payload;
      return this.service
        .getIntegrations(startRange, endRange, params)
        .pipe(
          map((data: IWallsIntegration[]) => new fromActions.GetIntegrationsSuccess(data)),
          catchError((error) => of(new fromActions.GetIntegrationsFail(error)))
        );
    })
  );

  @Effect()
  deleteIntegration$: Observable<
    fromActions.DeleteIntegrationSuccess | fromActions.DeleteIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.DELETE_INTEGRATION),
    mergeMap((action: fromActions.DeleteIntegration) => {
      const { integrationId, params } = action.payload;
      return this.service
        .deleteIntegration(integrationId, params)
        .pipe(
          map(() => new fromActions.DeleteIntegrationSuccess({ deletedId: integrationId })),
          catchError((error) => of(new fromActions.DeleteIntegrationFail(error)))
        );
    })
  );

  @Effect()
  createIntegration$: Observable<
    fromActions.PostIntegrationSuccess | fromActions.PostIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.POST_INTEGRATION),
    mergeMap((action: fromActions.PostIntegration) => {
      const { body, params } = action.payload;
      return this.service
        .createIntegration(body, params)
        .pipe(
          map((data: IWallsIntegration) => new fromActions.PostIntegrationSuccess(data)),
          catchError((error) => of(new fromActions.PostIntegrationFail(error)))
        );
    })
  );

  @Effect()
  editIntegration$: Observable<
    fromActions.EditIntegrationSuccess | fromActions.EditIntegrationFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.EDIT_INTEGRATION),
    mergeMap((action: fromActions.EditIntegration) => {
      const { integrationId, body, params } = action.payload;
      return this.service
        .editIntegration(integrationId, body, params)
        .pipe(
          map((edited: IWallsIntegration) => new fromActions.EditIntegrationSuccess(edited)),
          catchError((error) => of(new fromActions.EditIntegrationFail(error)))
        );
    })
  );

  @Effect()
  getSocialPostCategories$: Observable<
    fromActions.GetSocialPostCategoriesSuccess | fromActions.GetSocialPostCategoriesFail
  > = this.actions$.pipe(
    ofType(fromActions.IntegrationActions.GET_SOCIAL_POST_CATEGORIES),
    mergeMap((action: fromActions.PostIntegration) => {
      const { params } = action.payload;
      return this.service
        .getSocialPostCategories(params)
        .pipe(
          map((data: IItem[]) => new fromActions.GetSocialPostCategoriesSuccess(data)),
          catchError((error) => of(new fromActions.GetSocialPostCategoriesFail(error)))
        );
    })
  );

  constructor(private actions$: Actions, private service: WallsIntegrationsService) {}
}
