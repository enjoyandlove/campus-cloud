import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { RouterReducerState } from '@ngrx/router-store';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';

import { CPSession } from '@campus-cloud/session';
import { Paginated } from '@campus-cloud/shared/utils/http';
import { commonParams } from '@campus-cloud/shared/constants';
import { CPI18nService } from '@campus-cloud/shared/services';
import { baseActionClass } from '@campus-cloud/store/base';
import { IMember } from '@campus-cloud/libs/members/common/model';
import * as fromActions from '../actions/members.actions';
import * as fromSocialGroup from '../actions/social-groups.actions';
import {
  LibsCommonMembersService,
  LibsCommonMembersUtilsService
} from '@campus-cloud/libs/members/common/providers';

@Injectable()
export class OrientationMembersEffects extends Paginated {
  constructor(
    private actions$: Actions,
    private session: CPSession,
    private cpI18n: CPI18nService,
    private route: ActivatedRoute,
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
    switchMap(({ groupId }) => {
      const queryParams = this.route.snapshot.queryParams;

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
