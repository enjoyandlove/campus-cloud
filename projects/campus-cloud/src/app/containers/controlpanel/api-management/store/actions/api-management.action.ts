import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { IPublicApiAccessToken } from '../../api-management.interface';

export const loadRequest = createAction('[API Management] get Tokens');

export const loadFailure = createAction(
  '[API Management] get Token fail',
  props<{ error: HttpErrorResponse }>()
);

export const loadSuccess = createAction(
  '[API Management] get Token success',
  props<{ data: IPublicApiAccessToken[]; next: boolean; previous: boolean }>()
);
