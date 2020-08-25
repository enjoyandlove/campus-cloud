import { createAction, props } from '@ngrx/store';


export enum HealthPassPageActionsTypes {
  ENTER_HEALTH_PASS_PAGE = '[Health-Pass Page] Enter',
  EDIT_HEALTH_PASS_PAGE = '[Health-Pass Page] Edit',
  INIT_SUCCESS_MESSAGE_HEALTH_PASS_PAGE = '[Health-Pass Page] Init success message',
  INIT_ERROR_MESSAGE_HEALTH_PASS_PAGE = '[Health-Pass Page] Init error message'
}


export const enter = createAction(
  HealthPassPageActionsTypes.ENTER_HEALTH_PASS_PAGE,
  props<{school_id: string}> ()
);

export const edit = createAction(
  HealthPassPageActionsTypes.EDIT_HEALTH_PASS_PAGE,
  props<{healthPassList: any[], school_id: string}> ()
);

export const initSuccessMessage = createAction(
  HealthPassPageActionsTypes.INIT_SUCCESS_MESSAGE_HEALTH_PASS_PAGE
);

export const initErrorMessage = createAction(
  HealthPassPageActionsTypes.INIT_ERROR_MESSAGE_HEALTH_PASS_PAGE
);
