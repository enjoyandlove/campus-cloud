import { createSelector } from '@ngrx/store';
import * as fromNotificationTemplate from '@controlpanel/contact-trace/health-pass/store/reducers/notification-template.reducer';
import { State } from '@controlpanel/contact-trace/health-pass/store/selectors/health-pass.selector';


export const selectNotificationTemplateState = (state: State) => {
  return state.healthPassSettings.notificationTemplate;
};

export const selectAllNotificationTemplates = createSelector(
  selectNotificationTemplateState,
  fromNotificationTemplate.selectAll
);


export const selectDisplayTemplateSuccessMessage = createSelector(
  selectNotificationTemplateState,
  fromNotificationTemplate.displaySuccessMessage
);
/*
export const selectDisplayErrorMessage = createSelector(
  selectHealthPassState,
  fromHealthPass.displayErrorMessage
);
*/
