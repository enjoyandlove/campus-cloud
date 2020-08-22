import { ActionReducerMap } from '@ngrx/store';
import * as fromHealthPass from '@controlpanel/contact-trace/health-pass/store/reducers/health-pass.reducer';
import * as fromNotificationTemplate from '@controlpanel/contact-trace/health-pass/store/reducers/notification-template.reducer';

export interface HealthPassGlobalState {
  healthPass: fromHealthPass.HealthPassState;
  notificationTemplate: fromNotificationTemplate.NotificationTemplateState;
}

export const reducers: ActionReducerMap<HealthPassGlobalState> = {
  healthPass: fromHealthPass.reducer,
  notificationTemplate: fromNotificationTemplate.reducer
};
