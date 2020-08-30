import { createAction, props } from '@ngrx/store';

export enum ExposureeNotificationPageTypes {
  SELECT_CASE_STATUS_NOTIFICATION_PAGE = '[Exposure Notification Page] Select Case Status'
}

export const selectCaseStatus = createAction(
  ExposureeNotificationPageTypes.SELECT_CASE_STATUS_NOTIFICATION_PAGE,
  props<{ school_id: string }>()
);
