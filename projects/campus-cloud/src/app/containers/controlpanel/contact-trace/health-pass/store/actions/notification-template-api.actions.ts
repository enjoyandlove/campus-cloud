import { createAction, props } from '@ngrx/store';
import { INotificationTemplate } from '../../notification-templates/notification-template';

export enum NotificationTemplateApiActionsTypes {
  LOAD_NOTIFICATION_TEMPLATE_SUCCESS = '[NOTIFICATION_TEMPLATE_SETTING API] Loaded Success',
  LOAD_NOTIFICATION_TEMPLATE_FAIL = '[NOTIFICATION_TEMPLATE_SETTING API] Loaded Fail',
  UPDATE_NOTIFICATION_TEMPLATE_SUCCESS = '[NOTIFICATION_TEMPLATE_SETTING API] Updated Success',
  UPDATE_NOTIFICATION_TEMPLATE_FAIL = '[NOTIFICATION_TEMPLATE_SETTING API] Updated Fail'
}

export const notificationTemplateLoadedSuccess = createAction(
  NotificationTemplateApiActionsTypes.LOAD_NOTIFICATION_TEMPLATE_SUCCESS,
  props<{ templates: INotificationTemplate[] }>()
);

export const notificationTemplateLoadedFail = createAction(
  NotificationTemplateApiActionsTypes.LOAD_NOTIFICATION_TEMPLATE_FAIL,
  props<{ error: string }>()
);

export const notificationTemplateUpdatedSuccess = createAction(
  NotificationTemplateApiActionsTypes.UPDATE_NOTIFICATION_TEMPLATE_SUCCESS,
  props<{ templates: INotificationTemplate[] }>()
);

export const notificationTemplatesUpdatedFail = createAction(
  NotificationTemplateApiActionsTypes.UPDATE_NOTIFICATION_TEMPLATE_FAIL,
  props<{ error: string }>()
);
