import { INotificationTemplate } from '../../notification-templates/notification-template';
import { Action, createReducer, on } from '@ngrx/store';
import { NotificationTemplateApiActions, NotificationTemplatePageActions } from '../actions';

export interface NotificationTemplateState {
  templates: INotificationTemplate[];
  displaySuccessMessage: boolean;
  displayErrorMessage: boolean;
}

export const initialState: NotificationTemplateState = {
  templates: [],
  displaySuccessMessage: false,
  displayErrorMessage: false
};

export const notificationTemplateReducer = createReducer(
  initialState,
  on(NotificationTemplatePageActions.enter, (state) => {
    return {
      ...state
    };
  }),
  on(NotificationTemplatePageActions.edit, (state, action) => {
    return {
      ...state
    };
  }),
  on(NotificationTemplateApiActions.notificationTemplateLoadedSuccess, (state, action) => {
    return {
      ...state,
      templates: action.templates
    };
  }),
  on(NotificationTemplateApiActions.notificationTemplateUpdatedSuccess, (state, action) => {
    return {
      ...state,
      displaySuccessMessage: true
    };
  }),
  on(NotificationTemplatePageActions.initSuccessMessage, (state) => {
    return {
      ...state,
      displaySuccessMessage: false
    };
  })
);


export function reducer(state: NotificationTemplateState, action: Action) {
  return notificationTemplateReducer(state, action);
}


export const selectAll = (state: NotificationTemplateState) => state.templates;
export const displaySuccessMessage = (state: NotificationTemplateState) => state.displaySuccessMessage;
