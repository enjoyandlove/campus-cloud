import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { IPublicApiAccessToken } from '../../model';

export const loadRequest = createAction('[API Management] get Tokens');

export const loadFailure = createAction(
  '[API Management] get Token fail',
  props<{ error: HttpErrorResponse }>()
);

export const loadSuccess = createAction(
  '[API Management] get Token success',
  props<{ data: IPublicApiAccessToken[]; next: boolean; previous: boolean }>()
);

export const loadRequestById = createAction(
  '[API Management] get Token by id',
  props<{ tokenId: string }>()
);

export const loadRequestByIdSuccess = createAction(
  '[API Management] get Token by id success',
  props<{ data: IPublicApiAccessToken }>()
);

export const loadRequestByIdFailure = createAction(
  '[API Management] get Token by id failure',
  props<{ error: HttpErrorResponse }>()
);

export const postRequest = createAction(
  '[API Management] post Token',
  props<{ payload: IPublicApiAccessToken }>()
);

export const postFailure = createAction(
  '[API Management] post Token fail',
  props<{ error: HttpErrorResponse }>()
);

export const postSuccess = createAction(
  '[API Management] post Token success',
  props<{ data: IPublicApiAccessToken }>()
);

export const editRequest = createAction(
  '[API Management] edit Token',
  props<{ payload: { tokenId: string; body: IPublicApiAccessToken } }>()
);

export const editFailure = createAction(
  '[API Management] edit Token fail',
  props<{ error: HttpErrorResponse }>()
);

export const editSuccess = createAction(
  '[API Management] edit Token success',
  props<{ data: IPublicApiAccessToken }>()
);

export const deleteRequest = createAction(
  '[API Management] delete Token',
  props<{ payload: IPublicApiAccessToken }>()
);

export const deleteFailure = createAction(
  '[API Management] delete Token fail',
  props<{ error: HttpErrorResponse }>()
);

export const deleteSuccess = createAction(
  '[API Management] delete Token success',
  props<{ deletedId: string }>()
);
