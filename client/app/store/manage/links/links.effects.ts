import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { HttpParams } from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

import { CPSession } from '@app/session';
import * as fromActions from './links.actions';
import { getLinksState } from '../manage.selectors';
import { ILink } from '@app/containers/controlpanel/manage/links/link.interface';
import { LinksService } from '@app/containers/controlpanel/manage/links/links.service';

@Injectable()
export class LinksEffects {
  @Effect()
  loadLinks$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LinksActionTypes.LOAD_LINKS),
    withLatestFrom(this.state$.select(getLinksState)),
    switchMap(([_action, state]) => {
      const start = state.range.start_range;
      const end = state.range.end_range;
      const search = new HttpParams()
        .set('is_system', '0')
        .set('search_str', state.search_str)
        .set('sort_field', state.sort.sort_field)
        .set('sort_direction', state.sort.sort_direction)
        .set('school_id', this.session.g.get('school').id.toString());

      return this.service
        .getLinks(start, end, search)
        .pipe(
          map((links: ILink[]) => new fromActions.LoadLinksSuccess(links)),
          catchError((error) => of(new fromActions.LoadLinksFailure(error)))
        );
    })
  );

  @Effect()
  createLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LinksActionTypes.CREATE_LINK),
    map((action: fromActions.CreateLink) => action.payload),
    switchMap((link) => {
      return this.service
        .createLink(link)
        .pipe(
          map((createdLink: ILink) => new fromActions.CreateLinkSuccess(createdLink)),
          catchError((error) => of(new fromActions.CreateLinkFailure(error)))
        );
    })
  );

  @Effect()
  deleteLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LinksActionTypes.DELETE_LINK),
    map((action: fromActions.DeleteLink) => action.payload),
    switchMap((id) => {
      return this.service
        .deleteLink(id)
        .pipe(
          map(() => new fromActions.DeleteLinkSuccess(id)),
          catchError((error) => of(new fromActions.DeleteLinkFailure(error)))
        );
    })
  );

  @Effect()
  updateLink$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LinksActionTypes.UPDATE_LINK),
    map((action: fromActions.UpdateLink) => action.payload),
    switchMap((payload) => {
      return this.service
        .updateLink(payload.link, payload.id)
        .pipe(
          map((updatedLink: ILink) => new fromActions.UpdateLinkSuccess(updatedLink)),
          catchError((error) => of(new fromActions.UpdateLinkFailure(error)))
        );
    })
  );

  constructor(
    private service: LinksService,
    private session: CPSession,
    private actions$: Actions,
    private state$: Store<any>
  ) {}
}
