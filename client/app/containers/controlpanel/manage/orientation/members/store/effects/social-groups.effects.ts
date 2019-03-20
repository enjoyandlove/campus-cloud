import { map, mergeMap, catchError, switchMapTo } from 'rxjs/operators';
import { RouterReducerState } from '@ngrx/router-store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromRoot from '@app/store';
import { CPSession } from '@client/app/session';
import { ISocialGroup } from '../../../../feeds/model';
import { CPI18nService } from '@client/app/shared/services';
import * as fromActions from '../actions/social-groups.actions';
import { baseActionClass, getRouterState } from '@app/store/base';
import { LibsCommonMembersService } from '@libs/members/common/providers';

@Injectable()
export class OrientationSocialGroupEffects {
  @Effect()
  getSocialGroups$: Observable<
    fromActions.GetSocialGroupsSuccess | fromActions.GetSocialGroupsFail
  > = this.actions$.pipe(
    ofType(fromActions.SocialGroupTypes.GET_SOCIAL_GROUPS),
    switchMapTo(this.store.select(getRouterState)),
    mergeMap(({ params }) => {
      const search = new HttpParams()
        .set('school_id', this.session.g.get('school').id)
        .set('calendar_id', params.orientationId);

      return this.service.getSocialGroupDetails(search).pipe(
        map(
          (socialGroups: ISocialGroup[]) => new fromActions.GetSocialGroupsSuccess({ socialGroups })
        ),
        catchError((err) => {
          this.store.dispatch(
            new baseActionClass.SnackbarError({
              body: this.cpI18n.translate('something_ent_wrong')
            })
          );
          return of(new fromActions.GetSocialGroupsFail(err));
        })
      );
    })
  );

  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private service: LibsCommonMembersService,
    private store: Store<RouterReducerState | fromRoot.ISnackbar>
  ) {}
}
