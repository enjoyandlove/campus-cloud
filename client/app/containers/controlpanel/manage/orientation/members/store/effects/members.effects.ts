import { map, mergeMap, catchError, withLatestFrom, switchMap, delay } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterReducerState } from '@ngrx/router-store';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { CPSession } from '@app/session';
import { Paginated } from '@shared/utils/http';
import { commonParams } from '@shared/constants';
import { CPI18nService } from '@shared/services';
import { IMember } from '@libs/members/common/model';
import * as fromActions from '../actions/members.actions';
import { baseActionClass, getRouterState } from '@app/store/base';
import * as fromSocialGroup from '../actions/social-groups.actions';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@libs/members/common/providers';

@Injectable()
export class OrientationMembersEffects extends Paginated {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private store: Store<RouterReducerState>,
    private service: LibsCommonMembersService,
    private membersUtils: LibsCommonMembersUtilsService
  ) {
    super();
  }

  @Effect()
  getMembers$: Observable<
    fromActions.GetMembersSuccess | fromActions.GetMembersFail
  > = this.actions$.pipe(
    ofType(fromActions.MembersType.GET_MEMBERS),
    map((action: fromActions.GetMembers) => action.payload),
    withLatestFrom(this.store.select(getRouterState)),
    delay(100),
    switchMap(([{ groupId }, { queryParams }]) => {
      const allowedQueryParams = [
        commonParams.page,
        commonParams.searchStr,
        commonParams.sortField,
        commonParams.sortDirection
      ];

      let search = new HttpParams()
        .set('group_id', groupId.toString())
        .set(commonParams.schoool, this.session.g.get('school').id);

      this.page = queryParams[commonParams.page];

      for (const key in queryParams) {
        if (allowedQueryParams.includes(key)) {
          search = search.set(key, queryParams[key]);
        }
      }

      return this.service.getMembers(search, this.startRage, this.endRange).pipe(
        map(
          (members: IMember[]) => new fromActions.GetMembersSuccess(this.paginateResults(members))
        ),
        catchError(() => {
          this.errorHandler();
          return of(new fromActions.GetMembersFail());
        })
      );
    })
  );

  @Effect()
  createMember$: Observable<
    fromActions.CreateMemberSuccess | fromActions.CreateMemberFail
  > = this.actions$.pipe(
    ofType(fromActions.MembersType.CREATE_MEMBER),
    map((action: fromActions.CreateMember) => action.payload),
    mergeMap(({ member, memberId }) => {
      return this.service.addMember(member, memberId).pipe(
        map((newMember: IMember) => {
          this.successHandler();
          this.membersUtils.trackMemberCreate(newMember);

          return new fromActions.CreateMemberSuccess(newMember);
        }),
        catchError(() => {
          this.errorHandler();
          return of(new fromActions.CreateMemberFail());
        })
      );
    })
  );

  @Effect()
  editMember$: Observable<
    fromActions.EditMemberSuccess | fromActions.EditMemberFail
  > = this.actions$.pipe(
    ofType(fromActions.MembersType.EDIT_MEMBER),
    map((action: fromActions.CreateMember) => action.payload),
    mergeMap(({ member, memberId }) => {
      return this.service.addMember(member, memberId).pipe(
        map((editedMember: IMember) => {
          this.successHandler();
          this.membersUtils.trackMemberEdit(editedMember);

          return new fromActions.EditMemberSuccess(editedMember);
        }),
        catchError(() => {
          this.errorHandler();
          return of(new fromActions.EditMemberFail());
        })
      );
    })
  );

  @Effect()
  deleteMember$: Observable<
    fromActions.DeleteMemberSuccess | fromActions.DeleteMemberFail
  > = this.actions$.pipe(
    ofType(fromActions.MembersType.DELETE_MEMBER),
    map((action: fromActions.DeleteMember) => action.payload),
    mergeMap(({ body, memberId }) => {
      return this.service.removeMember(body, memberId).pipe(
        map((deletedMember: IMember) => {
          this.successHandler();
          this.membersUtils.trackMemberDelete();

          return new fromActions.DeleteMemberSuccess(deletedMember);
        }),
        catchError(() => {
          this.errorHandler();
          return of(new fromActions.DeleteMemberFail());
        })
      );
    })
  );

  @Effect()
  fromSocialGroup$: Observable<fromActions.GetMembers> = this.actions$.pipe(
    ofType(fromSocialGroup.SocialGroupTypes.GET_SOCIAL_GROUPS_SUCCESS),
    map((action: fromSocialGroup.GetSocialGroupsSuccess) => action.payload),
    map(({ socialGroups }) => socialGroups[0]),
    mergeMap((socialGroup) => of(new fromActions.GetMembers({ groupId: socialGroup.id })))
  );

  private errorHandler() {
    this.store.dispatch(
      new baseActionClass.SnackbarError({
        body: this.cpI18n.translate('something_went_wrong')
      })
    );
  }

  private successHandler() {
    this.store.dispatch(
      new baseActionClass.SnackbarSuccess({
        body: this.cpI18n.translate('t_shared_saved_update_success_message')
      })
    );
  }
}
