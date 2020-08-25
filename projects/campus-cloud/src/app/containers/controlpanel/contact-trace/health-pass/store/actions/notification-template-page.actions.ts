import { createAction, props } from '@ngrx/store';
import { INotificationTemplate } from '../../notification-templates/notification-template';

export enum NotificationTemplatePageActionsTypes {
  ENTER_NOTIFICATION_TEMPLATE_PAGE = '[Notification-Template-Setting Page] Enter',
  EDIT_NOTIFICATION_TEMPLATE_SETTING = '[Edit-Notification-Template-Setting] Edit',
  INIT_SUCCESS_MESSAGE_NOTIFICATION_TEMPLATE_SETTING = '[Notification-Template-Setting Page] Init success message',
  INIT_ERROR_MESSAGE_NOTIFICATION_TEMPLATE_SETTING = '[Notification-Template-Setting Page] Init error message'
}

export const enter = createAction(
  NotificationTemplatePageActionsTypes.ENTER_NOTIFICATION_TEMPLATE_PAGE
);

export const edit = createAction(
  NotificationTemplatePageActionsTypes.EDIT_NOTIFICATION_TEMPLATE_SETTING,
  props<{ updatedTemplates: INotificationTemplate[] }>()
);


export const initSuccessMessage = createAction(
  NotificationTemplatePageActionsTypes.INIT_SUCCESS_MESSAGE_NOTIFICATION_TEMPLATE_SETTING
);

